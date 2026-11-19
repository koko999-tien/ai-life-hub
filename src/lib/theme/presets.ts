export type CustomThemePresetId =
  | 'default'
  | 'fontaine-aqua'
  | 'moonlit-lotus'
  | 'black-shores'
  | 'eldritch-crimson'
  | 'wlop-cosmic'
  | 'silver-ink'
  | 'ghibli-emerald'
  | 'sakura-ronin'
  | 'snowy-violet'
  | 'midnight-obsidian'

export type FrameOrnamentStyle = 'sync' | 'double_gold' | 'glass' | 'minimal'

export interface CustomThemePreset {
  id: CustomThemePresetId
  name: string
  subtitle: string
  badge: string
  description: string
  accentHex: string
  accentHoverHex: string
  secondaryHex: string
  glowColor: string
  secondaryGlowColor: string
  overlayRgb: string
  frameBg: string
  cardBg: string
  borderColor: string
  textColor: string
  textMutedColor: string
  wallpaperUrl: string | null
  wallpaperVideoUrl: string | null
  pureBgGradient: string | null
  hasOrnamentByDefault: boolean
  cornerSvgUrl: string
  ornamentSvgUrl: string
  swatches: [string, string, string]
}

export interface CustomThemeState {
  presetId: CustomThemePresetId
  frameStyle: FrameOrnamentStyle
  dimming: number
  wallpaperEnabled: boolean
  liveVideoEnabled: boolean
  customWallpaperDataUrl: string
  ornamentsEnabled: boolean
  sketchRevealEnabled: boolean
}

export const CUSTOM_THEME_STORAGE_KEY = 'ai_life_hub_custom_theme_v1'

export const DEFAULT_CUSTOM_THEME_STATE: CustomThemeState = {
  presetId: 'default',
  frameStyle: 'sync',
  dimming: 74,
  wallpaperEnabled: true,
  liveVideoEnabled: true,
  customWallpaperDataUrl: '',
  ornamentsEnabled: true,
  sketchRevealEnabled: true,
}

export const CUSTOM_THEME_PRESETS: CustomThemePreset[] = [
  {
    id: 'default',
    name: 'Mặc Định (Hổ Phách Chuẩn)',
    subtitle: 'Giao diện gốc tối ưu đọc sâu & độ tương phản cao',
    badge: 'Chuẩn gốc',
    description:
      'Bảng màu Hổ Phách & Đá Phiến nguyên bản của AI Life Hub, tự động đồng bộ chế độ Sáng/Tối.',
    accentHex: '#f59e0b',
    accentHoverHex: '#d97706',
    secondaryHex: '#0ea5e9',
    glowColor: 'rgba(245, 158, 11, 0.22)',
    secondaryGlowColor: 'rgba(14, 165, 233, 0.14)',
    overlayRgb: '9, 9, 11',
    frameBg: 'rgba(24, 24, 27, 0.78)',
    cardBg: 'rgba(24, 24, 27, 0.65)',
    borderColor: 'rgba(245, 158, 11, 0.28)',
    textColor: '#fafafa',
    textMutedColor: '#a1a1aa',
    wallpaperUrl: null,
    wallpaperVideoUrl: null,
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    cornerSvgUrl: '/themes/wlop_corner.svg',
    ornamentSvgUrl: '/themes/wlop_ornament.svg',
    swatches: ['#f59e0b', '#0ea5e9', '#18181b'],
  },
  {
    id: 'fontaine-aqua',
    name: 'Thủy Thần Lam Ngọc (Furina Live)',
    subtitle: 'Nền video động MP4 đại dương pha lê mượt mà',
    badge: 'LIVE MP4',
    description:
      'Tông xanh lam ngọc (#38bdf8) kết hợp chàm đại dương trên nền video động Furina Live.',
    accentHex: '#38bdf8',
    accentHoverHex: '#0284c7',
    secondaryHex: '#818cf8',
    glowColor: 'rgba(56, 189, 248, 0.34)',
    secondaryGlowColor: 'rgba(129, 140, 248, 0.24)',
    overlayRgb: '8, 15, 28',
    frameBg: 'rgba(14, 23, 42, 0.66)',
    cardBg: 'rgba(16, 28, 50, 0.62)',
    borderColor: 'rgba(56, 189, 248, 0.38)',
    textColor: '#f0f9ff',
    textMutedColor: '#bae6fd',
    wallpaperUrl: '/themes/furina-poster.webp',
    wallpaperVideoUrl: '/themes/furina-bg.mp4',
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    cornerSvgUrl: '/themes/wlop_corner.svg',
    ornamentSvgUrl: '/themes/wlop_ornament.svg',
    swatches: ['#38bdf8', '#818cf8', '#080f1c'],
  },
  {
    id: 'moonlit-lotus',
    name: 'Thuyền Sen Ánh Trăng (Iuno Live)',
    subtitle: 'Video động sóng nước ánh trăng & bướm phát sáng',
    badge: 'LIVE MP4',
    description:
      'Nền động hồ sen ánh trăng kết hợp khung viền vàng kim cổ điển và sắc xanh tinh vân dịu mắt.',
    accentHex: '#93c5fd',
    accentHoverHex: '#60a5fa',
    secondaryHex: '#fbbf24',
    glowColor: 'rgba(147, 197, 253, 0.32)',
    secondaryGlowColor: 'rgba(251, 191, 36, 0.24)',
    overlayRgb: '6, 10, 22',
    frameBg: 'rgba(12, 18, 36, 0.66)',
    cardBg: 'rgba(14, 22, 44, 0.62)',
    borderColor: 'rgba(147, 197, 253, 0.40)',
    textColor: '#f8fafc',
    textMutedColor: '#cbd5e1',
    wallpaperUrl: '/themes/moonlit_lotus_skiff_poster.webp',
    wallpaperVideoUrl: '/themes/moonlit_lotus_skiff_bg.mp4',
    pureBgGradient: null,
    hasOrnamentByDefault: true,
    cornerSvgUrl: '/themes/wlop_corner.svg',
    ornamentSvgUrl: '/themes/wlop_ornament.svg',
    swatches: ['#93c5fd', '#fbbf24', '#060a16'],
  },
  {
    id: 'black-shores',
    name: 'Bờ Biển Đen Tinh Tú (Shorekeeper Live)',
    subtitle: 'Video động quần đảo sao đêm & hoa văn pha lê bạc',
    badge: 'LIVE MP4',
    description:
      'Lấy cảm hứng từ Black Shores với video động biển sao ngọc lam siêu nhẹ và hoa văn tinh tú.',
    accentHex: '#22d3ee',
    accentHoverHex: '#06b6d4',
    secondaryHex: '#818cf8',
    glowColor: 'rgba(34, 211, 238, 0.32)',
    secondaryGlowColor: 'rgba(129, 140, 248, 0.22)',
    overlayRgb: '5, 11, 22',
    frameBg: 'rgba(10, 18, 34, 0.66)',
    cardBg: 'rgba(12, 22, 42, 0.62)',
    borderColor: 'rgba(34, 211, 238, 0.38)',
    textColor: '#f0f9ff',
    textMutedColor: '#a5f3fc',
    wallpaperUrl: '/themes/black_shores_archipelago_poster.webp',
    wallpaperVideoUrl: '/themes/black_shores_archipelago.mp4',
    pureBgGradient: null,
    hasOrnamentByDefault: true,
    cornerSvgUrl: '/themes/ink_starlight_corner.svg',
    ornamentSvgUrl: '/themes/ink_starlight_ornament.svg',
    swatches: ['#22d3ee', '#818cf8', '#050b16'],
  },
  {
    id: 'eldritch-crimson',
    name: 'Hư Không Đỏ Thẫm (Ronova Live)',
    subtitle: 'Video động nhật thực đỏ thẫm huyền bí siêu nhẹ',
    badge: 'LIVE MP4',
    description:
      'Phong cách nhật thực hắc ám với nền video chuyển động dưới 1MB và điểm nhấn đỏ ruby sắc nét.',
    accentHex: '#f43f5e',
    accentHoverHex: '#e11d48',
    secondaryHex: '#fb7185',
    glowColor: 'rgba(244, 63, 94, 0.34)',
    secondaryGlowColor: 'rgba(251, 113, 133, 0.24)',
    overlayRgb: '16, 5, 10',
    frameBg: 'rgba(24, 8, 15, 0.68)',
    cardBg: 'rgba(30, 10, 18, 0.64)',
    borderColor: 'rgba(244, 63, 94, 0.42)',
    textColor: '#fff1f2',
    textMutedColor: '#fecdd3',
    wallpaperUrl: '/themes/ronova_poster.webp',
    wallpaperVideoUrl: '/themes/eldritch_bg.mp4',
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    cornerSvgUrl: '/themes/ink_starlight_corner.svg',
    ornamentSvgUrl: '/themes/ink_starlight_ornament.svg',
    swatches: ['#f43f5e', '#fb7185', '#10050a'],
  },
  {
    id: 'wlop-cosmic',
    name: 'Vũ Trụ Vàng Kim (WLOP Cosmic)',
    subtitle: 'Viền họa tiết cổ điển vàng kim & tranh 2K',
    badge: 'Kiệt tác 2K',
    description:
      'Lấy cảm hứng từ tranh kỹ thuật số WLOP với viền vàng ánh kim (#eab308), họa tiết góc nhạc khúc ánh sao và nền tranh 2K.',
    accentHex: '#eab308',
    accentHoverHex: '#ca8a04',
    secondaryHex: '#38bdf8',
    glowColor: 'rgba(234, 179, 8, 0.34)',
    secondaryGlowColor: 'rgba(56, 189, 248, 0.24)',
    overlayRgb: '12, 16, 28',
    frameBg: 'rgba(15, 20, 35, 0.66)',
    cardBg: 'rgba(18, 24, 42, 0.62)',
    borderColor: 'rgba(234, 179, 8, 0.42)',
    textColor: '#f8fafc',
    textMutedColor: '#cbd5e1',
    wallpaperUrl: '/themes/wlop_cosmic_2k.webp',
    wallpaperVideoUrl: null,
    pureBgGradient: null,
    hasOrnamentByDefault: true,
    cornerSvgUrl: '/themes/wlop_corner.svg',
    ornamentSvgUrl: '/themes/wlop_ornament.svg',
    swatches: ['#eab308', '#38bdf8', '#0c101c'],
  },
  {
    id: 'silver-ink',
    name: 'Thủy Mặc Tinh Tú (Silver Ink)',
    subtitle: 'Tranh thủy mặc đơn sắc bạch kim & hoa văn ánh sao',
    badge: 'Thủy mặc 2K',
    description:
      'Tranh mực tàu đơn sắc tương phản cao kết hợp sắc trắng bạch kim (#e2e8f0) và hoa văn SVG riêng biệt.',
    accentHex: '#e2e8f0',
    accentHoverHex: '#cbd5e1',
    secondaryHex: '#94a3b8',
    glowColor: 'rgba(226, 232, 240, 0.28)',
    secondaryGlowColor: 'rgba(148, 163, 184, 0.20)',
    overlayRgb: '6, 7, 10',
    frameBg: 'rgba(12, 14, 20, 0.72)',
    cardBg: 'rgba(16, 19, 28, 0.68)',
    borderColor: 'rgba(226, 232, 240, 0.36)',
    textColor: '#f8fafc',
    textMutedColor: '#cbd5e1',
    wallpaperUrl: '/themes/ink_starlight_2k.webp',
    wallpaperVideoUrl: null,
    pureBgGradient: null,
    hasOrnamentByDefault: true,
    cornerSvgUrl: '/themes/ink_starlight_corner.svg',
    ornamentSvgUrl: '/themes/ink_starlight_ornament.svg',
    swatches: ['#f8fafc', '#94a3b8', '#06070a'],
  },
  {
    id: 'ghibli-emerald',
    name: 'Ghibli Ngọc Bích (Zoro 2K)',
    subtitle: 'Sắc xanh ngọc bích rừng thẳm & hoa văn lá ngọc',
    badge: 'Ghibli 2K',
    description:
      'Phong cách màu nước Studio Ghibli với tông xanh ngọc lục bảo (#34d399) dịu mắt và hoa văn góc riêng.',
    accentHex: '#34d399',
    accentHoverHex: '#10b981',
    secondaryHex: '#2dd4bf',
    glowColor: 'rgba(52, 211, 153, 0.30)',
    secondaryGlowColor: 'rgba(45, 212, 191, 0.22)',
    overlayRgb: '3, 18, 21',
    frameBg: 'rgba(6, 28, 32, 0.68)',
    cardBg: 'rgba(8, 34, 38, 0.64)',
    borderColor: 'rgba(52, 211, 153, 0.40)',
    textColor: '#ecfdf5',
    textMutedColor: '#a7f3d0',
    wallpaperUrl: '/themes/ghibli_emerald_zoro_2k.webp',
    wallpaperVideoUrl: null,
    pureBgGradient: null,
    hasOrnamentByDefault: true,
    cornerSvgUrl: '/themes/ghibli_emerald_corner.svg',
    ornamentSvgUrl: '/themes/ghibli_emerald_ornament.svg',
    swatches: ['#34d399', '#2dd4bf', '#031215'],
  },
  {
    id: 'sakura-ronin',
    name: 'Anh Đào Đêm OLED (Sakura Ronin)',
    subtitle: 'Nền đen tuyền OLED & cánh hoa anh đào hồng rực',
    badge: 'OLED 2K',
    description:
      'Nền đen sâu tiết kiệm mắt kết hợp tán hoa anh đào hồng phấn (#f472b6) nổi bật từng chi tiết.',
    accentHex: '#f472b6',
    accentHoverHex: '#ec4899',
    secondaryHex: '#fbcfe8',
    glowColor: 'rgba(244, 114, 182, 0.32)',
    secondaryGlowColor: 'rgba(251, 207, 232, 0.20)',
    overlayRgb: '8, 4, 10',
    frameBg: 'rgba(18, 8, 18, 0.68)',
    cardBg: 'rgba(22, 10, 22, 0.64)',
    borderColor: 'rgba(244, 114, 182, 0.38)',
    textColor: '#fdf2f8',
    textMutedColor: '#fbcfe8',
    wallpaperUrl: '/themes/sakura_ronin_2k.webp',
    wallpaperVideoUrl: null,
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    cornerSvgUrl: '/themes/wlop_corner.svg',
    ornamentSvgUrl: '/themes/wlop_ornament.svg',
    swatches: ['#f472b6', '#fbcfe8', '#08040a'],
  },
  {
    id: 'snowy-violet',
    name: 'Tuyết Tím Ngân Hà (Snowy Violet)',
    subtitle: 'Sắc tím hoa cà huyền ảo & hồng ánh sao',
    badge: 'Gemini-chan',
    description:
      'Phối màu tím thạch anh (#a78bfa) và hồng ngân hà (#f472b6) trên lớp nền nghệ thuật Snowy Violet.',
    accentHex: '#a78bfa',
    accentHoverHex: '#8b5cf6',
    secondaryHex: '#f472b6',
    glowColor: 'rgba(167, 139, 250, 0.34)',
    secondaryGlowColor: 'rgba(244, 114, 182, 0.24)',
    overlayRgb: '14, 11, 24',
    frameBg: 'rgba(22, 17, 36, 0.66)',
    cardBg: 'rgba(26, 20, 42, 0.62)',
    borderColor: 'rgba(167, 139, 250, 0.38)',
    textColor: '#faf5ff',
    textMutedColor: '#d8b4fe',
    wallpaperUrl: '/themes/wallpapergeminichan-poster.webp',
    wallpaperVideoUrl: null,
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    cornerSvgUrl: '/themes/wlop_corner.svg',
    ornamentSvgUrl: '/themes/wlop_ornament.svg',
    swatches: ['#a78bfa', '#f472b6', '#0e0b18'],
  },
  {
    id: 'midnight-obsidian',
    name: 'Hắc Diện Thạch (Obsidian)',
    subtitle: 'Không gian kính tối sâu không dùng ảnh nền',
    badge: 'Siêu mượt 0 ảnh',
    description:
      'Nền dải ngân hà tím chàm thuần CSS kết hợp bề mặt kính mờ tinh khiết, cực nhẹ cho máy cấu hình thấp.',
    accentHex: '#818cf8',
    accentHoverHex: '#6366f1',
    secondaryHex: '#c084fc',
    glowColor: 'rgba(129, 140, 248, 0.3)',
    secondaryGlowColor: 'rgba(192, 132, 252, 0.22)',
    overlayRgb: '9, 11, 20',
    frameBg: 'rgba(15, 18, 30, 0.72)',
    cardBg: 'rgba(18, 22, 36, 0.68)',
    borderColor: 'rgba(129, 140, 248, 0.35)',
    textColor: '#f1f5f9',
    textMutedColor: '#94a3b8',
    wallpaperUrl: null,
    wallpaperVideoUrl: null,
    pureBgGradient:
      'radial-gradient(ellipse at 20% 0%, rgba(79, 70, 229, 0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(147, 51, 234, 0.18) 0%, transparent 55%), linear-gradient(135deg, #07080f 0%, #0d101d 50%, #090a10 100%)',
    hasOrnamentByDefault: true,
    cornerSvgUrl: '/themes/ink_starlight_corner.svg',
    ornamentSvgUrl: '/themes/ink_starlight_ornament.svg',
    swatches: ['#818cf8', '#c084fc', '#090b14'],
  },
]

export const FRAME_STYLE_OPTIONS: {
  id: FrameOrnamentStyle
  name: string
  desc: string
}[] = [
  {
    id: 'sync',
    name: 'Đồng bộ theo chủ đề',
    desc: 'Tự động bật hoa văn góc riêng cho WLOP, Thủy Mặc, Ghibli, Thuyền Sen & Bờ Biển Đen',
  },
  {
    id: 'double_gold',
    name: 'Viền kép Cổ Điển & Hoa văn SVG',
    desc: 'Khung viền đôi cổ điển kèm họa tiết góc SVG đồng bộ tông màu',
  },
  {
    id: 'glass',
    name: 'Kính Pha Lê Trong Suốt',
    desc: 'Viền kính ánh sáng dịu, bo góc mềm mại không hoa văn',
  },
  {
    id: 'minimal',
    name: 'Tối Giản Hiện Đại',
    desc: 'Chỉ giữ màu nhấn và hình nền, lược bỏ hoàn toàn khung trang trí',
  },
]

export function getPresetById(id: CustomThemePresetId): CustomThemePreset {
  return CUSTOM_THEME_PRESETS.find((p) => p.id === id) || CUSTOM_THEME_PRESETS[0]
}

export function loadCustomThemeState(): CustomThemeState {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_THEME_STATE
  try {
    const raw = window.localStorage.getItem(CUSTOM_THEME_STORAGE_KEY)
    if (!raw) return DEFAULT_CUSTOM_THEME_STATE
    const parsed = JSON.parse(raw) as Partial<CustomThemeState>
    const presetExists = CUSTOM_THEME_PRESETS.some((p) => p.id === parsed.presetId)
    return {
      presetId: presetExists ? (parsed.presetId as CustomThemePresetId) : 'default',
      frameStyle:
        parsed.frameStyle === 'sync' ||
        parsed.frameStyle === 'double_gold' ||
        parsed.frameStyle === 'glass' ||
        parsed.frameStyle === 'minimal'
          ? parsed.frameStyle
          : 'sync',
      dimming:
        typeof parsed.dimming === 'number' && parsed.dimming >= 30 && parsed.dimming <= 95
          ? Math.round(parsed.dimming)
          : 74,
      wallpaperEnabled:
        typeof parsed.wallpaperEnabled === 'boolean' ? parsed.wallpaperEnabled : true,
      liveVideoEnabled:
        typeof parsed.liveVideoEnabled === 'boolean' ? parsed.liveVideoEnabled : true,
      customWallpaperDataUrl:
        typeof parsed.customWallpaperDataUrl === 'string' ? parsed.customWallpaperDataUrl : '',
      ornamentsEnabled:
        typeof parsed.ornamentsEnabled === 'boolean' ? parsed.ornamentsEnabled : true,
      sketchRevealEnabled:
        typeof parsed.sketchRevealEnabled === 'boolean' ? parsed.sketchRevealEnabled : true,
    }
  } catch {
    return DEFAULT_CUSTOM_THEME_STATE
  }
}

export function saveCustomThemeState(state: CustomThemeState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new CustomEvent('custom-theme-change', { detail: state }))
  } catch {
    // Ignore storage quota errors
  }
}

export function resolveEffectiveOrnamentMode(
  state: CustomThemeState,
  preset: CustomThemePreset
): boolean {
  if (state.presetId === 'default' && !state.customWallpaperDataUrl) return false
  if (!state.ornamentsEnabled) return false
  if (state.frameStyle === 'double_gold') return true
  if (state.frameStyle === 'glass' || state.frameStyle === 'minimal') return false
  return preset.hasOrnamentByDefault
}
