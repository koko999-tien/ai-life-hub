export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  skillCount: number;
  promptCount: number;
  agentCount: number;
  resourceCount: number;
  slug: string;
}

export interface Skill {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  whenToUse: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  prompts: Prompt[];
  agentTemplate?: AgentTemplate;
  relatedSkillIds: string[];
  author?: string;
  source?: string;
  version: string;
  updatedAt: string;
  slug: string;
}

export interface Prompt {
  id: string;
  skillId: string;
  name: string;
  description: string;
  template: string;
  variables: PromptVariable[];
  examples: PromptExample[];
  tips?: string[];
  difficulty: 'easy' | 'medium' | 'advanced';
  useCases: string[];
  copiedCount?: number;
  rating?: number;
}

export interface PromptVariable {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'date';
  label: string;
  description?: string;
  required: boolean;
  default?: string;
  options?: string[];
}

export interface PromptExample {
  inputs: Record<string, string>;
  output: string;
  context?: string;
}

export interface AgentTemplate {
  name: string;
  description: string;
  systemPrompt: string;
  tools?: string[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  exampleConversations?: AgentConversation[];
}

export interface AgentConversation {
  role: 'user' | 'assistant';
  content: string;
}

export interface Resource {
  id: string;
  categoryId?: string;
  skillId?: string;
  type: 'course' | 'paper' | 'article' | 'video' | 'tool' | 'newsletter' | 'glossary';
  title: string;
  description: string;
  url: string;
  source: string;
  difficulty?: string;
  duration?: string;
  free: boolean;
  language: 'vi' | 'en' | 'both';
  tags: string[];
}

export interface SearchResult {
  id: string;
  type: 'category' | 'skill' | 'prompt' | 'agent' | 'resource' | 'tool';
  title: string;
  description: string;
  categoryId?: string;
  skillId?: string;
  tags: string[];
  url: string;
}

export interface SearchIndex {
  version: string;
  generatedAt: string;
  documents: SearchDocument[];
  index?: any;
}

export interface SearchDocument {
  id: string;
  type: SearchResult['type'];
  title: string;
  content: string;
  categoryId?: string;
  skillId?: string;
  tags: string[];
  url: string;
  boost?: number;
  // Độ khó đã chuẩn hóa về beginner | intermediate | advanced
  // (prompt gốc dùng easy/medium được map ở scripts/build-search-index.ts).
  difficulty?: DifficultyLevel;
  // Trường đã chuẩn hóa (không dấu) do build-search-index.ts tiền tính,
  // để searchDocuments không phải normalize lại mỗi lần tìm kiếm.
  // Index cũ chưa có 2 trường này thì searchDocuments tự normalize fallback.
  titleNorm?: string;
  contentNorm?: string;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
  resolved: 'light' | 'dark';
}

export interface FavoritesState {
  skills: string[];
  prompts: string[];
  resources: string[];
  categories: string[];
}

export interface PromptBuilderState {
  skillId: string;
  promptId: string;
  variables: Record<string, string>;
  generatedPrompt: string;
}

export interface MDXContent<T> {
  frontMatter: T;
  content: string;
  slug: string;
}

export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PromptDifficulty = 'easy' | 'medium' | 'advanced';
export type ResourceType = Resource['type'];
export type VariableType = PromptVariable['type'];