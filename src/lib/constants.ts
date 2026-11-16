export const CATEGORIES: Omit<Category, 'skillCount' | 'promptCount' | 'agentCount' | 'resourceCount' | 'slug'>[] = [
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
    description: 'Blog, copywriting, script video, SEO, email marketing',
    icon: 'PenTool',
    color: '#F59E0B',
  },
  {
    id: 'coding',
    name: 'Lập trình & Kỹ thuật',
    description: 'Code, debug, review, architecture, DevOps, AI/ML',
    icon: 'Code',
    color: '#10B981',
  },
  {
    id: 'design',
    name: 'Thiết kế & Sáng tạo',
    description: 'UI/UX, graphic, video, 3D, prompt engineering cho Midjourney',
    icon: 'Palette',
    color: '#EC4899',
  },
  {
    id: 'finance',
    name: 'Tài chính & Đầu tư',
    description: 'Ngân sách, đầu tư, thuế, kế hoạch tài chính, crypto',
    icon: 'Wallet',
    color: '#059669',
  },
  {
    id: 'health',
    name: 'Sức khỏe & Thể chất',
    description: 'Dinh dưỡng, tập luyện, mental health, y tế',
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
    description: 'Thiết kế nội thất, sửa chữa, IoT, tiết kiệm năng lượng',
    icon: 'Home',
    color: '#84CC16',
  },
  {
    id: 'parenting',
    name: 'Giáo dục & Học tập cho con',
    description: 'Dạy con, hoạt động phù hợp tuổi, màn hình, kỹ năng sống',
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
    name: 'Sáng tạo & Side Project',
    description: 'Ý tưởng, MVP, validate, marketing, scale',
    icon: 'Rocket',
    color: '#14B8A6',
  },
  {
    id: 'research',
    name: 'Nghiên cứu & Phân tích',
    description: 'Tổng hợp tài liệu, phân tích dữ liệu, academic writing',
    icon: 'Microscope',
    color: '#6366F1',
  },
  {
    id: 'entertainment',
    name: 'Giải trí & Sống ý nghĩa',
    description: 'Đọc sách, xem phim, game, hobby, meditation, journaling',
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
  newsletter: 'Newsletter',
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
  description: 'Trợ lý AI toàn diện cho mọi khía cạnh cuộc sống - Skills, Prompts, Agents, Tài liệu miễn phí',
  url: 'https://ai-life-hub.vercel.app',
  ogImage: '/og-default.png',
  twitterHandle: '@ailifehub',
  githubRepo: 'https://github.com/yourusername/ai-life-hub',
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

const categoryIds = new Set(CATEGORIES.map((c) => c.id));