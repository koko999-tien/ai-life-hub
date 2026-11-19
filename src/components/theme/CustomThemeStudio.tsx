'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Palette,
  X,
  Sparkles,
  Check,
  Upload,
  Trash2,
  RotateCcw,
  Tv,
  Brush,
  Frame,
  Image as ImageIcon,
} from 'lucide-react'
import {
  CUSTOM_THEME_PRESETS,
  CustomThemePresetId,
  CustomThemeState,
  DEFAULT_CUSTOM_THEME_STATE,
  FRAME_STYLE_OPTIONS,
  FrameOrnamentStyle,
  getPresetById,
  loadCustomThemeState,
  saveCustomThemeState,
} from '@/lib/theme/presets'
import { StarfieldBootHud } from './StarfieldBootHud'
import { clsx } from 'clsx'

export function CustomThemeStudio() {
  const [isOpen, setIsOpen] = useState(false)
  const [bootHudOpen, setBootHudOpen] = useState(false)
  const [state, setState] = useState<CustomThemeState>(DEFAULT_CUSTOM_THEME_STATE)
  const [uploadNotice, setUploadNotice] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setState(loadCustomThemeState())
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<CustomThemeState>
      setState(custom.detail || loadCustomThemeState())
    }
    window.addEventListener('custom-theme-change', handleSync)
    return () => window.removeEventListener('custom-theme-change', handleSync)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !bootHudOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, bootHudOpen])

  const updateState = (patch: Partial<CustomThemeState>) => {
    const next: CustomThemeState = { ...state, ...patch }
    setState(next)
    saveCustomThemeState(next)
  }

  const handleSelectPreset = (presetId: CustomThemePresetId) => {
    const preset = getPresetById(presetId)
    const next: CustomThemeState = {
      ...state,
      presetId,
      ornamentsEnabled: presetId === 'default' ? false : preset.hasOrnamentByDefault || state.ornamentsEnabled,
    }
    setState(next)
    saveCustomThemeState(next)
  }

  const handleReset = () => {
    setState(DEFAULT_CUSTOM_THEME_STATE)
    saveCustomThemeState(DEFAULT_CUSTOM_THEME_STATE)
    setUploadNotice('Đã khôi phục phong cách Hổ Phách nguyên bản.')
    window.setTimeout(() => setUploadNotice(null), 2500)
  }

  const handleReplaySketch = () => {
    window.dispatchEvent(new CustomEvent('custom-theme-replay-sketch'))
  }

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.onload = () => {
        const maxW = 1600
        const scale = Math.min(1, maxW / Math.max(1, img.naturalWidth))
        const w = Math.round(img.naturalWidth * scale)
        const h = Math.round(img.naturalHeight * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, w, h)
        const dataUrl = canvas.toDataURL('image/webp', 0.82)
        updateState({
          customWallpaperDataUrl: dataUrl,
          wallpaperEnabled: true,
          presetId: state.presetId === 'default' ? 'wlop-cosmic' : state.presetId,
        })
        setUploadNotice('Đã nén ảnh nền sang WebP và kích hoạt hiệu ứng vẽ nét!')
        window.setTimeout(() => setUploadNotice(null), 3500)
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const activePreset = getPresetById(state.presetId)
  const isCustomActive =
    state.presetId !== 'default' || Boolean(state.customWallpaperDataUrl)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Xưởng tùy biến phong cách nghệ thuật"
        title="Xưởng tùy biến phong cách nghệ thuật"
        className={clsx(
          'relative p-2 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          isCustomActive
            ? 'border-accent bg-accent/15 text-accent shadow-sm'
            : 'border-border text-text-muted hover:text-accent hover:border-accent/50'
        )}
      >
        <Palette className="w-4 h-4" />
        {isCustomActive && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-bg"
            style={{ backgroundColor: activePreset.accentHex }}
          />
        )}
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="custom-theme-studio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-theme-studio-title"
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false)
            }}
          >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-bg-surface text-text shadow-2xl overflow-hidden">
            {/* Decorative Top Corner Ornaments inside Studio Modal */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/themes/wlop_corner.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-2.5 left-2.5 w-10 h-10 opacity-70"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/themes/wlop_corner.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-2.5 right-2.5 w-10 h-10 opacity-70 -scale-x-100"
            />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-bg/60">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl border text-white shadow-sm"
                  style={{
                    backgroundColor: `${activePreset.accentHex}22`,
                    borderColor: `${activePreset.accentHex}66`,
                    color: activePreset.accentHex,
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="custom-theme-studio-title"
                      className="text-lg font-display font-bold text-text"
                    >
                      Xưởng Tùy Biến Phong Cách Nghệ Thuật
                    </h2>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-accent/15 text-accent border border-accent/30">
                      WLOP & Kính Mờ
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Tùy chỉnh chủ đề Vũ Trụ Vàng Kim, Hắc Diện Thạch, họa tiết góc SVG và hiệu ứng vẽ nét loang màu nước
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng xưởng tùy biến phong cách"
                className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-hover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {uploadNotice && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-accent/15 border border-accent/40 text-xs font-medium text-accent">
                  <span>{uploadNotice}</span>
                </div>
              )}

              {/* 1. Preset Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-text flex items-center gap-2">
                    <Palette className="w-4 h-4 text-accent" />
                    <span>1. Chọn Chủ Đề Nghệ Thuật (5 Phong Cách)</span>
                  </h3>
                  <span className="text-xs text-text-muted">
                    Đang dùng: <strong className="text-accent">{activePreset.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CUSTOM_THEME_PRESETS.map((preset) => {
                    const isSelected = state.presetId === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        data-preset-option={preset.id}
                        className={clsx(
                          'group relative flex flex-col justify-between text-left p-4 rounded-xl border transition-all overflow-hidden',
                          isSelected
                            ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent'
                            : 'border-border bg-bg/60 hover:border-accent/50 hover:bg-hover'
                        )}
                      >
                        {/* Thumbnail / Swatch Bar */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span
                            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border"
                            style={{
                              backgroundColor: `${preset.accentHex}18`,
                              borderColor: `${preset.accentHex}55`,
                              color: preset.accentHex,
                            }}
                          >
                            {preset.badge}
                          </span>
                          <div className="flex items-center gap-1">
                            {preset.swatches.map((hex, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-white/25"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-text group-hover:text-accent transition-colors">
                              {preset.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                          </div>
                          <p className="mt-1 text-xs text-text-muted line-clamp-2">
                            {preset.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Frame & Ornament Style */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-border">
                <div>
                  <h3 className="text-sm font-bold text-text flex items-center gap-2 mb-3">
                    <Frame className="w-4 h-4 text-accent" />
                    <span>2. Kiểu Khung Kính & Hoa Văn Góc SVG</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FRAME_STYLE_OPTIONS.map((opt) => {
                      const active = state.frameStyle === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateState({ frameStyle: opt.id as FrameOrnamentStyle })}
                          className={clsx(
                            'text-left p-3 rounded-xl border transition-all',
                            active
                              ? 'border-accent bg-accent/10 text-text'
                              : 'border-border bg-bg/50 hover:border-accent/40 text-text-muted'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text">{opt.name}</span>
                            {active && <Check className="w-3.5 h-3.5 text-accent" />}
                          </div>
                          <p className="mt-1 text-[11px] text-text-muted leading-relaxed">
                            {opt.desc}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Dimming Scrim & Visual Toggles */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-accent" />
                    <span>3. Độ Phủ Kính Mờ & Ảnh Nền Cá Nhân</span>
                  </h3>

                  <div className="p-3.5 rounded-xl border border-border bg-bg/50 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="theme-dimming-slider" className="font-semibold text-text">
                        Độ đậm lớp phủ nền ( bảo vệ độ tương phản chữ )
                      </label>
                      <span className="font-mono font-bold text-accent">{state.dimming}%</span>
                    </div>
                    <input
                      id="theme-dimming-slider"
                      type="range"
                      min={30}
                      max={95}
                      value={state.dimming}
                      onChange={(e) => updateState({ dimming: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.wallpaperEnabled}
                          onChange={(e) => updateState({ wallpaperEnabled: e.target.checked })}
                          className="rounded accent-amber-500"
                        />
                        <span>Hiện ảnh nền 2K</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.ornamentsEnabled}
                          onChange={(e) => updateState({ ornamentsEnabled: e.target.checked })}
                          className="rounded accent-amber-500"
                        />
                        <span>Hoa văn góc SVG</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.sketchRevealEnabled}
                          onChange={(e) => updateState({ sketchRevealEnabled: e.target.checked })}
                          className="rounded accent-amber-500"
                        />
                        <span>Vẽ nét khi đổi nền</span>
                      </label>
                    </div>
                  </div>

                  {/* Custom Wallpaper Upload */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWallpaperUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-bg hover:border-accent/50 text-xs font-semibold text-text transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-accent" />
                      <span>Tải ảnh nền riêng (Tự nén WebP)</span>
                    </button>

                    {state.customWallpaperDataUrl && (
                      <button
                        type="button"
                        onClick={() => updateState({ customWallpaperDataUrl: '' })}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa ảnh riêng</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Interactive Experience Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-border bg-bg/80">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleReplaySketch}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent/15 border border-accent/40 text-accent hover:bg-accent hover:text-white text-xs font-bold transition-all"
                >
                  <Brush className="w-3.5 h-3.5" />
                  <span>Phát hiệu ứng Vẽ nét & Loang màu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBootHudOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-bg-surface hover:border-accent/50 text-text text-xs font-semibold transition-all"
                >
                  <Tv className="w-3.5 h-3.5 text-accent" />
                  <span>Phát màn hình khởi động Vũ trụ</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-text-muted hover:text-text text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục mặc định</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {bootHudOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <StarfieldBootHud
            isOpen={bootHudOpen}
            onClose={() => setBootHudOpen(false)}
            accentHex={activePreset.accentHex}
            presetName={activePreset.name}
          />,
          document.body
        )}
    </>
  )
}
