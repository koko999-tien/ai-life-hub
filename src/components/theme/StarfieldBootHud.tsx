'use client'

import { useEffect, useState } from 'react'

interface StarfieldBootHudProps {
  isOpen: boolean
  onClose: () => void
  accentHex?: string
  presetName?: string
}

const BOOT_PHASES = [
  'KHỞI TẠO LÕI TRÍ TUỆ AI LIFE HUB // VER 3.2',
  'ĐỒNG BỘ BẢNG MÃ 16 MÔ HÌNH & ĐỊNH TUYẾN ĐA NHÀ CUNG CẤP...',
  'NẠP LỚP KÍNH MỜ PRE-BAKED & HỌA TIẾT KHUNG VÀNG KIM...',
  'KÍCH HOẠT XƯỞNG TÙY BIẾN PHONG CÁCH // HOÀN TẤT 100%',
]

export function StarfieldBootHud({
  isOpen,
  onClose,
  accentHex = '#eab308',
  presetName = 'Vũ Trụ Vàng Kim (WLOP Cosmic)',
}: StarfieldBootHudProps) {
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setPhaseIndex(0)
      return
    }

    const start = performance.now()
    const duration = 2600
    let rafId = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)
      setPhaseIndex(Math.min(BOOT_PHASES.length - 1, Math.floor((pct / 100) * BOOT_PHASES.length)))

      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(tick)
      } else {
        window.setTimeout(() => {
          onClose()
        }, 280)
      }
    }

    rafId = window.requestAnimationFrame(tick)

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      id="hub-starfield-boot-hud"
      role="dialog"
      aria-modal="true"
      aria-label="Màn hình khởi động Vũ trụ AI Life Hub"
      className="fixed inset-0 z-[120] flex flex-col justify-between overflow-hidden bg-[#06070b] text-zinc-100 select-none"
    >
      {/* Starfield Monochrome Texture Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage: 'url(/themes/starfield-boot-bg.jpg)',
          filter: 'grayscale(35%) contrast(120%)',
        }}
      />

      {/* Radial Vignette & Subtle Scanline Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(12, 16, 28, 0.35) 0%, rgba(5, 7, 12, 0.92) 80%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Top Corner SVG Ornaments */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/themes/wlop_corner.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-5 left-5 w-16 h-16 opacity-80"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/themes/wlop_corner.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-5 right-5 w-16 h-16 opacity-80 -scale-x-100"
      />

      {/* Top Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7 text-xs font-mono tracking-widest text-zinc-400">
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: accentHex, boxShadow: `0 0 12px ${accentHex}` }}
          />
          <span>AI LIFE HUB // HỆ THỐNG KHỞI ĐỘNG GIAO DIỆN</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-zinc-200 transition-colors text-xs font-mono"
        >
          [ ESC ] BỎ QUA
        </button>
      </div>

      {/* Center Verification Rings & Emblem */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-6 text-center">
        <div className="relative flex items-center justify-center w-56 h-56 mb-6">
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: '14s' }}
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke={accentHex}
              strokeWidth="1.2"
              strokeDasharray="18 10 6 10"
              opacity="0.7"
            />
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="40 16"
              opacity="0.35"
            />
          </svg>

          <div
            className="flex flex-col items-center justify-center w-36 h-36 rounded-full border bg-black/50 shadow-2xl"
            style={{
              borderColor: `${accentHex}66`,
              boxShadow: `0 0 40px ${accentHex}33`,
            }}
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400">
              CHỦ ĐỀ
            </span>
            <span
              className="mt-1 text-2xl font-display font-extrabold tracking-tight"
              style={{ color: accentHex }}
            >
              {progress}%
            </span>
            <span className="mt-1 text-[10px] font-mono text-zinc-400">ĐỒNG BỘ</span>
          </div>
        </div>

        {/* Musical Ornament Flourish */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/themes/wlop_ornament.svg"
          alt=""
          aria-hidden="true"
          className="w-52 h-8 opacity-90 mb-3"
        />

        <h2 className="text-xl sm:text-2xl font-display font-bold tracking-wider uppercase text-white">
          {presetName}
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-mono tracking-wider text-zinc-300 max-w-lg">
          {BOOT_PHASES[phaseIndex]}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full max-w-md h-1.5 rounded-full bg-white/10 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              backgroundColor: accentHex,
              boxShadow: `0 0 16px ${accentHex}`,
            }}
          />
        </div>
      </div>

      {/* Bottom Footer Telemetry */}
      <div className="relative z-10 flex items-center justify-between px-8 pb-7 text-[11px] font-mono text-zinc-400">
        <span>KÍNH MỜ PRE-BAKED // 0ĐỘ TRỄ CUỘN</span>
        <span>PHác THẢO NÉT VẼ & LOANG MÀU NƯỚC</span>
      </div>

      {/* Bottom Corner SVG Ornaments */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/themes/wlop_corner.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-5 w-16 h-16 opacity-80 -scale-y-100"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/themes/wlop_corner.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-5 w-16 h-16 opacity-80 -scale-x-100 -scale-y-100"
      />
    </div>
  )
}
