import type { Category, DifficultyLevel, PromptDifficulty, ResourceType, VariableType } from '@/types';

export const CATEGORIES: Omit<Category, 'skillCount' | 'promptCount' | 'agentCount' | 'resourceCount' | 'slug'>[] = [
  {
    id: 'prompt-engineering',
    name: 'Kỹ năng Giao tiếp & Ra lệnh AI',
    description: 'Cách viết câu lệnh rõ ràng, suy luận từng bước, thiết lập vai trò AI và xây dựng trợ lý tự động',
    icon: 'Sparkles',
    color: '#8B5CF6',
  },
  {
    id: 'learning',
    name: 'Học tập & Phát triển bản thân',
    description: 'Học nhanh hơn, nhớ lâu hơn, áp dụng vào đời thực',
    icon: 'BookOpen',
    color: '#3B82F6',
  },
  {
    id: 'work',
    name: 'Công việc & Nghề nghiệp',
    description: 'CV, phỏng vấn, email, quản lý dự án, lãnh đạo',
    icon: 'Briefcase',
    color: '#8B5CF6',
  },
  {
    id: 'writing',
    name: 'Viết lách & Sáng tạo nội dung',
    description: 'Bài viết blog, viết quảng cáo, kịch bản video, tối ưu tìm kiếm (SEO) và email tiếp thị',
    icon: 'PenTool',
    color: '#F59E0B',
  },
  {
    id: 'coding',
    name: 'Lập trình & Kỹ thuật',
    description: 'Viết mã, tìm lỗi, đánh giá mã nguồn, thiết kế hệ thống, vận hành hệ thống và AI',
    icon: 'Code',
    color: '#10B981',
  },
  {
    id: 'design',
    name: 'Thiết kế & Sáng tạo',
    description: 'Giao diện người dùng (UI/UX), đồ họa, video, 3D và câu lệnh tạo ảnh bằng AI',
    icon: 'Palette',
    color: '#EC4899',
  },
  {
    id: 'finance',
    name: 'Tài chính & Đầu tư',
    description: 'Quản lý ngân sách, đầu tư, thuế, kế hoạch tài chính cá nhân và tài sản số',
    icon: 'Wallet',
    color: '#059669',
  },
  {
    id: 'health',
    name: 'Sức khỏe & Thể chất',
    description: 'Dinh dưỡng, tập luyện, sức khỏe tinh thần và chăm sóc y tế',
    icon: 'HeartPulse',
    color: '#EF4444',
  },
  {
    id: 'family',
    name: 'Gia đình & Mối quan hệ',
    description: 'Nuôi dạy, giao tiếp, giải quyết xung đột, lên kế hoạch gia đình',
    icon: 'Users',
    color: '#F97316',
  },
  {
    id: 'travel',
    name: 'Du lịch & Khám phá',
    description: 'Lập lịch trình, ngân sách, visa, trải nghiệm địa phương',
    icon: 'Plane',
    color: '#06B6D4',
  },
  {
    id: 'home',
    name: 'Nhà cửa & Sống thông minh',
    description: 'Thiết kế nội thất, sửa chữa, nhà thông minh (IoT) và tiết kiệm năng lượng',
    icon: 'Home',
    color: '#84CC16',
  },
  {
    id: 'parenting',
    name: 'Giáo dục & Học tập cho con',
    description: 'Dạy con học, hoạt động theo độ tuổi, quản lý thời gian dùng thiết bị và kỹ năng sống',
    icon: 'Baby',
    color: '#D946EF',
  },
  {
    id: 'legal',
    name: 'Pháp luật & Hành chính',
    description: 'Hiểu luật, thủ tục hành chính, hợp đồng, quyền công dân',
    icon: 'Scale',
    color: '#64748B',
  },
  {
    id: 'sideproject',
    name: 'Khởi nghiệp & Dự án Cá nhân',
    description: 'Tìm ý tưởng, làm sản phẩm thử nghiệm, kiểm chứng nhu cầu, tiếp thị và mở rộng',
    icon: 'Rocket',
    color: '#14B8A6',
  },
  {
    id: 'research',
    name: 'Nghiên cứu & Phân tích',
    description: 'Tổng hợp tài liệu, phân tích số liệu và viết báo cáo chuyên sâu',
    icon: 'Microscope',
    color: '#6366F1',
  },
  {
    id: 'entertainment',
    name: 'Giải trí & Sống ý nghĩa',
    description: 'Đọc sách, xem phim, trò chơi, sở thích cá nhân, thiền định và viết nhật ký',
    icon: 'Gamepad2',
    color: '#F43F5E',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, { ...c, slug: c.id }])
);

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const PROMPT_DIFFICULTY_LABELS: Record<PromptDifficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  advanced: 'Khó',
};

export const PROMPT_DIFFICULTY_COLORS: Record<PromptDifficulty, string> = {
  easy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  course: 'Khóa học',
  paper: 'Nghiên cứu',
  article: 'Bài viết',
  video: 'Video',
  tool: 'Công cụ',
  newsletter: 'Bản tin',
  glossary: 'Thuật ngữ',
};

export const RESOURCE_TYPE_ICONS: Record<ResourceType, string> = {
  course: 'GraduationCap',
  paper: 'FileText',
  article: 'Newspaper',
  video: 'PlayCircle',
  tool: 'Wrench',
  newsletter: 'Mail',
  glossary: 'BookOpen',
};

export const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
  course: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  paper: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  article: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  video: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  tool: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  newsletter: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  glossary: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export const VARIABLE_TYPE_LABELS: Record<VariableType, string> = {
  text: 'Văn bản ngắn',
  textarea: 'Văn bản dài',
  select: 'Chọn một',
  multiselect: 'Chọn nhiều',
  number: 'Số',
  date: 'Ngày tháng',
};

export const ICON_COMPONENTS = {
  BookOpen: 'BookOpen',
  Briefcase: 'Briefcase',
  PenTool: 'PenTool',
  Code: 'Code',
  Palette: 'Palette',
  Wallet: 'Wallet',
  HeartPulse: 'HeartPulse',
  Users: 'Users',
  Plane: 'Plane',
  Home: 'Home',
  Baby: 'Baby',
  Scale: 'Scale',
  Rocket: 'Rocket',
  Microscope: 'Microscope',
  Gamepad2: 'Gamepad2',
  GraduationCap: 'GraduationCap',
  FileText: 'FileText',
  Newspaper: 'Newspaper',
  PlayCircle: 'PlayCircle',
  Wrench: 'Wrench',
  Mail: 'Mail',
  Search: 'Search',
  Command: 'Command',
  Copy: 'Copy',
  Check: 'Check',
  Star: 'Star',
  Heart: 'Heart',
  Bookmark: 'Bookmark',
  Share2: 'Share2',
  Download: 'Download',
  ExternalLink: 'ExternalLink',
  Tag: 'Tag',
  Clock: 'Clock',
  AlertCircle: 'AlertCircle',
  Info: 'Info',
  Lightbulb: 'Lightbulb',
  Zap: 'Zap',
  Sparkles: 'Sparkles',
  Menu: 'Menu',
  X: 'X',
  Sun: 'Sun',
  Moon: 'Moon',
  Monitor: 'Monitor',
  ChevronDown: 'ChevronDown',
  ChevronRight: 'ChevronRight',
  ChevronLeft: 'ChevronLeft',
  ArrowRight: 'ArrowRight',
  ArrowLeft: 'ArrowLeft',
  Plus: 'Plus',
  Minus: 'Minus',
  Settings: 'Settings',
  User: 'User',
  LogOut: 'LogOut',
  Github: 'Github',
  Twitter: 'Twitter',
  Linkedin: 'Linkedin',
  MailIcon: 'Mail',
  Globe: 'Globe',
  Language: 'Languages',
} as const;

export const SEARCH_SHORTCUT = '⌘K';

export const APP_META = {
  name: 'AI Life Hub',
  description: 'Kho câu lệnh thực chiến, kỹ năng ứng dụng AI và công cụ hỗ trợ cho người đi làm & lập trình viên Việt Nam',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-life-hub-omega.vercel.app',
  ogImage: '/og-default.png',
  twitterHandle: '@ailifehub',
  githubRepo: 'https://github.com/koko999-tien/ai-life-hub',
};

export const STORAGE_KEYS = {
  theme: 'ai-life-hub-theme',
  favorites: 'ai-life-hub-favorites',
  recentSearches: 'ai-life-hub-recent-searches',
  promptHistory: 'ai-life-hub-prompt-history',
} as const;

export const LIMITS = {
  recentSearches: 10,
  promptHistory: 20,
  favorites: 100,
  searchResults: 50,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get category color by ID
 */
export function getCategoryColor(id: string): string {
  const category = CATEGORIES.find((c) => c.id === id);
  return category?.color || '#64748B';
}

/**
 * Get category icon by ID
 */
export function getCategoryIcon(id: string): string {
  const category = CATEGORIES.find((c) => c.id === id);
  return category?.icon || 'BookOpen';
}

/**
 * Get difficulty color class for skill difficulty
 */
export function getDifficultyColor(level: DifficultyLevel): string {
  return DIFFICULTY_COLORS[level] || DIFFICULTY_COLORS.beginner;
}

/**
 * Get difficulty label for skill difficulty
 */
export function getDifficultyLabel(level: DifficultyLevel): string {
  return DIFFICULTY_LABELS[level] || level;
}

/**
 * Get prompt difficulty color class
 */
export function getPromptDifficultyColor(level: PromptDifficulty): string {
  return PROMPT_DIFFICULTY_COLORS[level] || PROMPT_DIFFICULTY_COLORS.easy;
}

/**
 * Get prompt difficulty label
 */
export function getPromptDifficultyLabel(level: PromptDifficulty): string {
  return PROMPT_DIFFICULTY_LABELS[level] || level;
}

/**
 * Get resource type color class
 */
export function getResourceTypeColor(type: ResourceType): string {
  return RESOURCE_TYPE_COLORS[type] || RESOURCE_TYPE_COLORS.article;
}

/**
 * Get resource type icon
 */
export function getResourceTypeIcon(type: ResourceType): string {
  return RESOURCE_TYPE_ICONS[type] || RESOURCE_TYPE_ICONS.article;
}

/**
 * Get resource type label
 */
export function getResourceTypeLabel(type: ResourceType): string {
  return RESOURCE_TYPE_LABELS[type] || type;
}

/**
 * Get variable type label
 */
export function getVariableTypeLabel(type: VariableType): string {
  return VARIABLE_TYPE_LABELS[type] || type;
}

/**
 * Get icon component name from string
 */
export function getIconComponent(name: string): string {
  return ICON_COMPONENTS[name as keyof typeof ICON_COMPONENTS] || name;
}

/**
 * Get category by ID with full info including counts
 */
export function getCategoryById(id: string) {
  return CATEGORY_MAP[id];
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return CATEGORIES.map((c) => c.id);
}

/**
 * Check if category ID is valid
 */
export function isValidCategoryId(id: string): boolean {
  return categoryIds.has(id);
}

const categoryIds = new Set([
  ...CATEGORIES.map((c) => c.id),
  'hoc-tap', 'cong-viec', 'viet-lach', 'lap-trinh', 'thiet-ke', 'tai-chinh', 'suc-khoe',
  'gia-dinh', 'du-lich', 'nha-cua', 'giao-duc-con', 'phap-ly', 'side-project', 'nghien-cuu', 'giai-tri'
]);

export const TAG_LABELS: Record<string, string> = {
  accessibility: 'Khả năng tiếp cận (A11y)',
  accounting: 'Kế toán',
  'action-items': 'Việc cần làm',
  'active-listening': 'Lắng nghe chủ động',
  'active-recall': 'Chủ động gợi nhớ',
  'administrative-procedures': 'Thủ tục hành chính',
  admissions: 'Tuyển sinh',
  'ai-agent': 'Trợ lý AI',
  'ai-art': 'Tạo ảnh AI',
  'ai-coding': 'Lập trình cùng AI',
  'ai-development': 'Phát triển AI',
  aida: 'Mô hình viết AIDA',
  animation: 'Chuyển động giao diện',
  anki: 'Thẻ ghi nhớ Anki',
  anthropic: 'Anthropic',
  'api-design': 'Thiết kế API',
  'app-curation': 'Chọn lọc ứng dụng',
  architecture: 'Kiến trúc hệ thống',
  'auto-layout': 'Bố cục tự động',
  automation: 'Tự động hóa',
  bab: 'Mô hình Trước–Sau–Cầu nối',
  backend: 'Hệ thống máy chủ',
  'bao-cao': 'Báo cáo',
  'bao-mat': 'Bảo mật',
  bilingual: 'Song ngữ',
  biliteracy: 'Đọc viết song ngữ',
  blogging: 'Viết blog',
  bonding: 'Gắn kết gia đình',
  brainstorming: 'Động não ý tưởng',
  breathing: 'Kỹ thuật thở',
  bubble: 'Nền tảng Bubble',
  'budget-travel': 'Du lịch tiết kiệm',
  budgeting: 'Quản lý ngân sách',
  'business-registration': 'Đăng ký kinh doanh',
  cbt: 'Điều chỉnh nhận thức hành vi (CBT)',
  certification: 'Chứng chỉ',
  'chi-dan-he-thong': 'Chỉ dẫn hệ thống',
  'child-development': 'Phát triển trẻ em',
  'ci-cd': 'Triển khai tự động (CI/CD)',
  'circadian-rhythm': 'Nhịp sinh học',
  'civil-code': 'Bộ luật Dân sự',
  'civil-status': 'Hộ tịch',
  claude: 'Claude',
  'clean-code': 'Mã nguồn sạch',
  'clickbait-ethical': 'Tiêu đề thu hút chuẩn mực',
  coding: 'Lập trình',
  collaboration: 'Cộng tác nhóm',
  communication: 'Giao tiếp',
  community: 'Cộng đồng',
  'community-tourism': 'Du lịch cộng đồng',
  'component-library': 'Thư viện thành phần UI',
  'concept-mapping': 'Bản đồ khái niệm',
  'conflict-resolution': 'Giải quyết xung đột',
  connection: 'Kết nối',
  'content-creation': 'Sáng tạo nội dung',
  'content-marketing': 'Tiếp thị nội dung',
  'content-writing': 'Viết nội dung',
  'contract-law': 'Luật hợp đồng',
  'contract-review': 'Rà soát hợp đồng',
  copywriting: 'Viết quảng cáo & truyền thông',
  cot: 'Suy luận từng bước',
  creativity: 'Sáng tạo',
  'credit-card-rewards': 'Tối ưu thẻ tín dụng',
  'css-animation': 'Chuyển động CSS',
  ctr: 'Tỷ lệ nhấp (CTR)',
  'cultural-immersion': 'Trải nghiệm văn hóa',
  cursor: 'Trình soạn thảo Cursor',
  'da-kenh': 'Đa kênh',
  'dau-tu': 'Đầu tư',
  dca: 'Đầu tư trung bình giá (DCA)',
  debugging: 'Gỡ lỗi hệ thống',
  decluttering: 'Dọn dẹp tối giản',
  deductions: 'Giảm trừ gia cảnh',
  'deep-understanding': 'Hiểu sâu bản chất',
  'deep-work': 'Làm việc tập trung sâu',
  design: 'Thiết kế',
  'design-critique': 'Phản biện thiết kế',
  'design-review': 'Đánh giá thiết kế',
  'design-system': 'Hệ thống thiết kế',
  'design-thinking': 'Tư duy thiết kế',
  'design-to-dev': 'Bàn giao thiết kế – lập trình',
  'design-tokens': 'Biến thiết kế (Design Tokens)',
  'developer-tools': 'Công cụ lập trình',
  'digital-citizenship': 'Công dân số',
  'digital-parenting': 'Nuôi dạy con thời số',
  'digital-signature': 'Chữ ký số',
  'dispute-resolution': 'Giải quyết tranh chấp',
  'distributed-systems': 'Hệ thống phân tán',
  diy: 'Tự sửa chữa tại nhà',
  'early-math': 'Toán tư duy sớm',
  'eco-tourism': 'Du lịch sinh thái',
  'education-fund': 'Quỹ giáo dục cho con',
  electrical: 'Điện gia dụng',
  email: 'Viết email',
  'email-cong-so': 'Email công sở',
  'emergency-fund': 'Quỹ dự phòng khẩn cấp',
  'emotion-coaching': 'Đồng hành cảm xúc cùng con',
  'employment-contract': 'Hợp đồng lao động',
  'energy-management': 'Quản lý năng lượng',
  entertainment: 'Giải trí',
  'estate-planning': 'Hoạch định tài sản thừa kế',
  etf: 'Quỹ hoán đổi danh mục (ETF)',
  'evidence-based': 'Dựa trên bằng chứng',
  'executive-function': 'Kỹ năng điều hành tự chủ',
  'expense-tracking': 'Theo dõi chi tiêu',
  family: 'Gia đình',
  'family-finance': 'Tài chính gia đình',
  'family-meeting': 'Họp mặt gia đình',
  'family-rituals': 'Nếp sinh hoạt gia đình',
  feedback: 'Góp ý xây dựng',
  figma: 'Figma',
  finance: 'Tài chính',
  'financial-planning': 'Lập kế hoạch tài chính',
  fire: 'Tự do tài chính (FIRE)',
  flutterflow: 'Nền tảng FlutterFlow',
  focus: 'Tập trung',
  'framer-motion': 'Framer Motion',
  'giac-ngu': 'Giấc ngủ',
  'giai-quyet-van-de': 'Giải quyết vấn đề',
  'giao-tiep': 'Giao tiếp',
  git: 'Quản lý mã nguồn Git',
  'goal-setting': 'Đặt mục tiêu',
  'goodness-of-fit': 'Chọn trường phù hợp cho con',
  graphql: 'GraphQL',
  gratitude: 'Thực hành biết ơn',
  growth: 'Tăng trưởng',
  'growth-mindset': 'Tư duy phát triển',
  guardrails: 'Nguyên tắc an toàn',
  guide: 'Hướng dẫn thực hành',
  'gym-programming': 'Lập lịch tập gym',
  handoff: 'Bàn giao công việc',
  handyman: 'Sửa chữa vặt',
  health: 'Sức khỏe',
  headline: 'Tiêu đề thu hút',
  'heritage-language': 'Giữ gìn tiếng mẹ đẻ',
  heuristics: 'Nguyên tắc đánh giá nhanh',
  home: 'Nhà cửa',
  'home-automation': 'Nhà thông minh tự động',
  'home-management': 'Quản lý việc nhà',
  'home-repair': 'Sửa chữa nhà cửa',
  homeschool: 'Học tập tại nhà',
  hook: 'Câu mở đầu thu hút (Hook)',
  hostel: 'Lưu trú tiết kiệm',
  hrv: 'Chỉ số phục hồi nhịp tim (HRV)',
  hypertrophy: 'Tăng cơ khoa học',
  ideation: 'Hình thành ý tưởng',
  'image-generation': 'Tạo ảnh AI',
  'index-fund': 'Quỹ chỉ số',
  'indie-hacking': 'Làm sản phẩm độc lập',
  innovation: 'Đổi mới sáng tạo',
  insurance: 'Bảo hiểm',
  'interior-design': 'Thiết kế nội thất',
  'international-school': 'Trường quốc tế',
  'interview-prep': 'Chuẩn bị phỏng vấn',
  investing: 'Đầu tư',
  itinerary: 'Lịch trình chuyến đi',
  'joint-retirement': 'Kế hoạch hưu trí gia đình',
  'kem-vi-du-mau': 'Kèm ví dụ mẫu',
  'keyword-research': 'Nghiên cứu từ khóa',
  'kiem-tra-code': 'Kiểm tra mã nguồn',
  'knowledge-graph': 'Đồ thị tri thức',
  konmari: 'Sắp xếp gọn gàng KonMari',
  'ky-thuat': 'Kỹ thuật',
  'labor-law': 'Luật lao động',
  land: 'Mua bán đất đai',
  'language-identity': 'Bản sắc ngôn ngữ',
  'language-learning': 'Học ngoại ngữ',
  'lap-ke-hoach': 'Lập kế hoạch',
  launch: 'Ra mắt sản phẩm',
  layout: 'Bố cục trình bày',
  'lean-startup': 'Khởi nghiệp tinh gọn',
  learning: 'Học tập',
  'learning-technique': 'Kỹ thuật học tập',
  legal: 'Pháp luật',
  'legal-compliance': 'Tuân thủ pháp lý',
  lighting: 'Ánh sáng không gian',
  'lo-trinh-hoc': 'Lộ trình học',
  logic: 'Tư duy logic',
  lottie: 'Hoạt ảnh Lottie',
  'macro-tracking': 'Theo dõi dinh dưỡng đa lượng',
  maintainability: 'Dễ bảo trì',
  maintenance: 'Bảo trì định kỳ',
  marketing: 'Tiếp thị',
  'meal-prep': 'Chuẩn bị bữa ăn khoa học',
  'media-literacy': 'Hiểu biết truyền thông số',
  meditation: 'Thiền định',
  'meeting-notes': 'Biên bản cuộc họp',
  memory: 'Ghi nhớ lâu dài',
  'mental-health': 'Sức khỏe tinh thần',
  'mental-models': 'Mô hình tư duy',
  mentoring: 'Hướng dẫn & cố vấn',
  'micro-interactions': 'Tương tác vi mô',
  midjourney: 'Midjourney',
  'miles-points': 'Tích điểm & dặm bay',
  mindfulness: 'Chánh niệm',
  minimalism: 'Sống tối giản',
  montessori: 'Phương pháp Montessori',
  'motion-design': 'Thiết kế chuyển động',
  multilingual: 'Đa ngôn ngữ',
  mvp: 'Sản phẩm thử nghiệm (MVP)',
  n8n: 'Tự động hóa n8n',
  'nang-cao-ky-nang': 'Nâng cao kỹ năng',
  nap: 'Nghỉ trưa khoa học',
  negotiation: 'Đàm phán',
  'ngan-sach': 'Ngân sách',
  'nguyen-tac-an-toan': 'Nguyên tắc an toàn',
  'nhip-sinh-hoc': 'Nhịp sinh học',
  'no-code': 'Làm ứng dụng không cần viết mã',
  notarization: 'Công chứng giấy tờ',
  nutrition: 'Dinh dưỡng',
  nvc: 'Giao tiếp bất bạo lực (NVC)',
  obsidian: 'Ghi chú Obsidian',
  openapi: 'Chuẩn tài liệu OpenAPI',
  opol: 'Một người một ngôn ngữ (OPOL)',
  organization: 'Sắp xếp ngăn nắp',
  overtime: 'Chế độ làm thêm giờ',
  packing: 'Chuẩn bị hành lý',
  'pair-programming': 'Lập trình đôi cùng AI',
  parenting: 'Nuôi dạy con',
  pas: 'Công thức viết PAS',
  passport: 'Hộ chiếu & giấy tờ',
  periodization: 'Phân kỳ tập luyện',
  persona: 'Chân dung người dùng',
  'personal-finance': 'Tài chính cá nhân',
  phonics: 'Đánh vần tiếng Anh',
  pkm: 'Quản lý tri thức cá nhân',
  planning: 'Lập kế hoạch',
  plumbing: 'Sửa ống nước cơ bản',
  pomodoro: 'Kỹ thuật tập trung Pomodoro',
  portfolio: 'Hồ sơ năng lực',
  'positive-discipline': 'Kỷ luật tích cực',
  'pre-sell': 'Kiểm chứng bán thử',
  pricing: 'Định giá sản phẩm',
  'problem-solution-fit': 'Giải đúng vấn đề thực tế',
  'product-development': 'Phát triển sản phẩm',
  'production-support': 'Hỗ trợ vận hành thực tế',
  productivity: 'Năng suất làm việc',
  'professional-writing': 'Viết lách chuyên nghiệp',
  'progressive-overload': 'Tăng tải lũy tiến',
  'prompt-engineering': 'Kỹ năng viết câu lệnh AI',
  prototyping: 'Tạo mẫu giao diện nhanh',
  'public-services': 'Dịch vụ công trực tuyến',
  'public-vs-private': 'So sánh trường công & tư',
  'quan-ly-tien': 'Quản lý tiền bạc',
  'ra-quyet-dinh': 'Ra quyết định',
  reasoning: 'Lập luận logic',
  recovery: 'Phục hồi thể chất',
  reels: 'Video ngắn Reels',
  refactoring: 'Tái cấu trúc mã nguồn',
  reggio: 'Phương pháp Reggio Emilia',
  research: 'Nghiên cứu',
  'responsible-travel': 'Du lịch có trách nhiệm',
  rest: 'Nghỉ ngơi phục hồi',
  'rest-api': 'Kiến trúc REST API',
  retirement: 'Chuẩn bị hưu trí',
  'retrieval-practice': 'Luyện tập truy xuất trí nhớ',
  'risk-management': 'Quản trị rủi ro',
  'root-cause-analysis': 'Phân tích nguyên nhân gốc rễ',
  sales: 'Bán hàng',
  'sang-tao-noi-dung': 'Sáng tạo nội dung',
  scalability: 'Khả năng mở rộng',
  'school-selection': 'Chọn trường cho con',
  'school-transition': 'Chuyển cấp cho con',
  'screen-time': 'Quản lý thời gian màn hình',
  'second-brain': 'Bộ não thứ hai',
  'self-management': 'Quản lý bản thân',
  seo: 'Tối ưu tìm kiếm (SEO)',
  'side-hustle': 'Dự án tay trái',
  sideproject: 'Dự án cá nhân',
  sleep: 'Giấc ngủ chất lượng',
  'slow-travel': 'Du lịch chậm trải nghiệm',
  'smart-home': 'Nhà thông minh',
  'social-insurance': 'Bảo hiểm xã hội',
  'software-craftsmanship': 'Kỹ nghệ phần mềm',
  'space-optimization': 'Tối ưu không gian sống',
  'spaced-repetition': 'Lặp lại ngắt quãng',
  storage: 'Lưu trữ gọn gàng',
  storytelling: 'Kể chuyện thu hút',
  'strength-training': 'Tập luyện sức mạnh',
  'stress-management': 'Quản lý căng thẳng',
  'study-techniques': 'Phương pháp học tập',
  'suc-khoe': 'Sức khỏe',
  supplements: 'Thực phẩm bổ sung',
  'sustainable-travel': 'Du lịch bền vững',
  'suy-luan-tung-buoc': 'Suy luận từng bước',
  'system-design': 'Thiết kế hệ thống',
  'system-prompt': 'Chỉ dẫn hệ thống',
  'tai-chinh': 'Tài chính cá nhân',
  tax: 'Thuế cá nhân',
  'tax-optimization': 'Tối ưu thuế hợp pháp',
  'tax-vietnam': 'Thuế tại Việt Nam',
  tdee: 'Năng lượng tiêu thụ mỗi ngày (TDEE)',
  teaching: 'Giảng dạy',
  'team-collaboration': 'Làm việc nhóm',
  'tech-contract': 'Hợp đồng công nghệ',
  termination: 'Chấm dứt hợp đồng',
  'test-prep': 'Ôn thi hiệu quả',
  tiktok: 'TikTok',
  'time-management': 'Quản lý thời gian',
  tncn: 'Thuế thu nhập cá nhân',
  'toi-uu-hieu-nang': 'Tối ưu hiệu năng',
  'tom-tat-van-ban': 'Tóm tắt văn bản',
  'tool-use': 'Kết nối công cụ cho AI',
  toolkit: 'Bộ công cụ',
  traditions: 'Truyền thống gia đình',
  travel: 'Du lịch',
  'travel-hacking': 'Mẹo du lịch tiết kiệm',
  'travel-hacks': 'Mẹo đi du lịch',
  'travel-planning': 'Lên kế hoạch du lịch',
  'tree-of-thought': 'Phân nhánh nhiều hướng suy luận',
  troubleshooting: 'Xử lý sự cố',
  'truyen-thong': 'Truyền thông',
  'tu-hoc': 'Tự học',
  'ui-design': 'Thiết kế giao diện (UI)',
  'unit-economics': 'Kinh tế đơn vị',
  'ux-design': 'Thiết kế trải nghiệm (UX)',
  validation: 'Kiểm chứng ý tưởng',
  variants: 'Biến thể giao diện',
  'version-control': 'Quản lý phiên bản',
  'video-script': 'Kịch bản video',
  'vietnam-tax': 'Thuế Việt Nam',
  visa: 'Thủ tục thị thực (Visa)',
  'visual-thinking': 'Tư duy trực quan',
  waldorf: 'Phương pháp Waldorf',
  webflow: 'Nền tảng Webflow',
  work: 'Công việc',
  'work-life-balance': 'Cân bằng công việc – cuộc sống',
  workflow: 'Quy trình làm việc',
  writing: 'Viết lách',
  zettelkasten: 'Ghi chú liên kết Zettelkasten',
};

/**
 * Resolve a raw frontmatter/slug tag to a natural accented Vietnamese display label.
 */
export function resolveTagLabel(tag: string): string {
  const trimmed = tag.trim();
  if (!trimmed) return '';
  const exact = TAG_LABELS[trimmed] ?? TAG_LABELS[trimmed.toLowerCase()];
  if (exact) return exact;
  const normalized = trimmed.replace(/-/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}