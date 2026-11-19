'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  CustomThemeState,
  DEFAULT_CUSTOM_THEME_STATE,
  getPresetById,
  loadCustomThemeState,
  resolveEffectiveOrnamentMode,
} from '@/lib/theme/presets'
import {
  buildProceduralStrokes,
  extractStrokesFromImage,
  runSketchBloomReveal,
  SketchStroke,
} from '@/lib/theme/sketch-reveal'

export function LiveThemeBackdrop() {
  const [state, setState] = useState<CustomThemeState>(DEFAULT_CUSTOM_THEME_STATE)
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const cancelSketchRef = useRef<(() => void) | null>(null)
  const strokesCacheRef = useRef<Record<string, SketchStroke[]>>({})

  const applyThemeTokensToDom = useCallback((nextState: CustomThemeState) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const preset = getPresetById(nextState.presetId)
    const isCustomActive =
      nextState.presetId !== 'default' || Boolean(nextState.customWallpaperDataUrl)
    const isOrnament = resolveEffectiveOrnamentMode(nextState, preset)

    if (!isCustomActive) {
      root.removeAttribute('data-custom-preset')
      root.removeAttribute('data-custom-frame')
      root.removeAttribute('data-custom-ornament')
      root.style.removeProperty('--color-accent-500')
      root.style.removeProperty('--color-accent-600')
      root.style.removeProperty('--color-brand-500')
      root.style.removeProperty('--theme-glow')
      root.style.removeProperty('--theme-secondary-glow')
      root.style.removeProperty('--theme-overlay-rgb')
      root.style.removeProperty('--theme-frame-bg')
      root.style.removeProperty('--theme-card-bg')
      root.style.removeProperty('--theme-border-color')
      return
    }

    root.setAttribute('data-custom-preset', nextState.presetId)
    root.setAttribute('data-custom-frame', nextState.frameStyle)
    root.setAttribute('data-custom-ornament', isOrnament ? 'true' : 'false')

    root.style.setProperty('--color-accent-500', preset.accentHex)
    root.style.setProperty('--color-accent-600', preset.accentHoverHex)
    root.style.setProperty('--color-brand-500', preset.secondaryHex)
    root.style.setProperty('--theme-glow', preset.glowColor)
    root.style.setProperty('--theme-secondary-glow', preset.secondaryGlowColor)
    root.style.setProperty('--theme-overlay-rgb', preset.overlayRgb)
    root.style.setProperty('--theme-frame-bg', preset.frameBg)
    root.style.setProperty('--theme-card-bg', preset.cardBg)
    root.style.setProperty('--theme-border-color', preset.borderColor)
  }, [])

  const triggerSketchReveal = useCallback((targetState: CustomThemeState) => {
    const canvas = canvasRef.current
    if (!canvas) return
    cancelSketchRef.current?.()

    const preset = getPresetById(targetState.presetId)
    const activeImgSrc =
      targetState.customWallpaperDataUrl || (targetState.wallpaperEnabled ? preset.wallpaperUrl : null)

    let strokes: SketchStroke[] = []
    if (activeImgSrc && strokesCacheRef.current[activeImgSrc]) {
      strokes = strokesCacheRef.current[activeImgSrc]
    } else if (
      activeImgSrc &&
      imgRef.current &&
      imgRef.current.complete &&
      imgRef.current.naturalWidth > 0
    ) {
      strokes = extractStrokesFromImage(imgRef.current)
      strokesCacheRef.current[activeImgSrc] = strokes
    } else {
      strokes = buildProceduralStrokes()
    }

    cancelSketchRef.current = runSketchBloomReveal({
      canvas,
      strokes,
      accentHex: preset.accentHex,
      secondaryHex: preset.secondaryHex,
      overlayRgb: preset.overlayRgb,
    })
  }, [])

  useEffect(() => {
    const initial = loadCustomThemeState()
    setState(initial)
    applyThemeTokensToDom(initial)
    setMounted(true)

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<CustomThemeState>
      const next = customEvent.detail || loadCustomThemeState()
      setState(next)
      applyThemeTokensToDom(next)
      if (next.sketchRevealEnabled && (next.presetId !== 'default' || next.customWallpaperDataUrl)) {
        window.setTimeout(() => triggerSketchReveal(next), 45)
      }
    }

    const handleReplaySketch = () => {
      const current = loadCustomThemeState()
      triggerSketchReveal(current)
    }

    window.addEventListener('custom-theme-change', handleThemeChange)
    window.addEventListener('custom-theme-replay-sketch', handleReplaySketch)
    return () => {
      window.removeEventListener('custom-theme-change', handleThemeChange)
      window.removeEventListener('custom-theme-replay-sketch', handleReplaySketch)
      cancelSketchRef.current?.()
    }
  }, [applyThemeTokensToDom, triggerSketchReveal])

  if (!mounted) return null

  const preset = getPresetById(state.presetId)
  const isCustomActive =
    state.presetId !== 'default' || Boolean(state.customWallpaperDataUrl)
  const activeWallpaperUrl =
    state.customWallpaperDataUrl || (state.wallpaperEnabled ? preset.wallpaperUrl : null)
  const activeVideoUrl =
    !state.customWallpaperDataUrl && state.wallpaperEnabled && state.liveVideoEnabled
      ? preset.wallpaperVideoUrl
      : null
  const isOrnament = resolveEffectiveOrnamentMode(state, preset)
  const scrimOpacity = Math.min(0.95, Math.max(0.3, state.dimming / 100))

  return (
    <>
      {/* Fixed Zero-Jank Ambient Wallpaper / Live MP4 Video & Scrim Layer */}
      {isCustomActive && (
        <div
          id="hub-live-bg-layer"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        >
          {/* Poster Image Layer (also feeds Sketch Reveal contour extractor) */}
          {activeWallpaperUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={activeWallpaperUrl}
              alt=""
              crossOrigin="anonymous"
              onLoad={() => {
                if (
                  imgRef.current &&
                  activeWallpaperUrl &&
                  !strokesCacheRef.current[activeWallpaperUrl]
                ) {
                  strokesCacheRef.current[activeWallpaperUrl] = extractStrokesFromImage(
                    imgRef.current
                  )
                }
              }}
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
            />
          ) : (
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background:
                  preset.pureBgGradient ||
                  'radial-gradient(ellipse at 20% 0%, rgba(234, 179, 8, 0.2) 0%, transparent 60%), linear-gradient(135deg, #07090e 0%, #0d1220 100%)',
              }}
            />
          )}

          {/* Live Animated MP4 Video Wallpaper Layer */}
          {activeVideoUrl && (
            <video
              key={activeVideoUrl}
              src={activeVideoUrl}
              poster={activeWallpaperUrl || undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}

          {/* Pre-Baked Dimming Scrim Layer (Zero live blur on scrollers) */}
          <div
            className="absolute inset-0 transition-colors duration-300"
            style={{
              backgroundColor: `rgba(${preset.overlayRgb}, ${scrimOpacity})`,
            }}
          />

          {/* Radial Accent Ambient Glows */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 18% 16%, ${preset.glowColor} 0%, transparent 48%), radial-gradient(circle at 82% 84%, ${preset.secondaryGlowColor} 0%, transparent 52%)`,
            }}
          />
        </div>
      )}

      {/* Fixed Viewport Ornamental Filigree Frame (when Ornament Mode is active) */}
      {isCustomActive && isOrnament && (
        <div
          id="hub-ornament-frame-layer"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[35] overflow-hidden select-none hidden sm:block"
        >
          <div
            className="absolute inset-3 rounded-2xl pointer-events-none"
            style={{
              border: `1px solid ${preset.borderColor}`,
              boxShadow: `inset 0 0 0 3px rgba(${preset.overlayRgb}, 0.35), inset 0 0 24px ${preset.glowColor}`,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preset.cornerSvgUrl}
            alt=""
            className="absolute top-3.5 left-3.5 w-14 h-14 opacity-85"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preset.cornerSvgUrl}
            alt=""
            className="absolute top-3.5 right-3.5 w-14 h-14 opacity-85 -scale-x-100"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preset.cornerSvgUrl}
            alt=""
            className="absolute bottom-3.5 left-3.5 w-14 h-14 opacity-85 -scale-y-100"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preset.cornerSvgUrl}
            alt=""
            className="absolute bottom-3.5 right-3.5 w-14 h-14 opacity-85 -scale-x-100 -scale-y-100"
          />
        </div>
      )}

      {/* Sketch & Watercolor Bloom Reveal Canvas */}
      <canvas
        ref={canvasRef}
        id="hub-sketch-reveal-canvas"
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[45] opacity-0 transition-opacity duration-200"
      />
    </>
  )
}
