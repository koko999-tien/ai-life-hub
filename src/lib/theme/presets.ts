export type CustomThemePresetId =
  | 'default'
  | 'wlop-cosmic'
  | 'midnight-obsidian'
  | 'snowy-violet'
  | 'fontaine-aqua'

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
  pureBgGradient: string | null
  hasOrnamentByDefault: boolean
  swatches: [string, string, string]
}

export interface CustomThemeState {
  presetId: CustomThemePresetId
  frameStyle: FrameOrnamentStyle
  dimming: number
  wallpaperEnabled: boolean
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
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    swatches: ['#f59e0b', '#0ea5e9', '#18181b'],
  },
  {
    id: 'wlop-cosmic',
    name: 'Vũ Trụ Vàng Kim (WLOP Cosmic)',
    subtitle: 'Viền họa tiết cổ điển vàng kim & ánh sao',
    badge: 'Kiệt tác hội họa',
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
    pureBgGradient: null,
    hasOrnamentByDefault: true,
    swatches: ['#eab308', '#38bdf8', '#0c101c'],
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
    pureBgGradient:
      'radial-gradient(ellipse at 20% 0%, rgba(79, 70, 229, 0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(147, 51, 234, 0.18) 0%, transparent 55%), linear-gradient(135deg, #07080f 0%, #0d101d 50%, #090a10 100%)',
    hasOrnamentByDefault: true,
    swatches: ['#818cf8', '#c084fc', '#090b14'],
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
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    swatches: ['#a78bfa', '#f472b6', '#0e0b18'],
  },
  {
    id: 'fontaine-aqua',
    name: 'Thủy Thần Lam Ngọc (Fontaine Aqua)',
    subtitle: 'Lam ngọc đại dương sâu thẳm & pha lê nước',
    badge: 'Furina Live',
    description:
      'Tông xanh lam ngọc (#38bdf8) kết hợp chàm đại dương (#818cf8), mang lại cảm giác mát mắt và thanh lịch.',
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
    pureBgGradient: null,
    hasOrnamentByDefault: false,
    swatches: ['#38bdf8', '#818cf8', '#080f1c'],
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
    desc: 'Tự động bật viền họa tiết vàng kim cho WLOP Cosmic & Obsidian',
  },
  {
    id: 'double_gold',
    name: 'Viền kép Vàng Kim & Hoa văn SVG',
    desc: 'Khung viền đôi cổ điển kèm họa tiết góc nhạc khúc ánh sao',
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
