import { CATEGORY_MAP } from '@/lib/constants';

export const CATEGORY_ALIAS_MAP: Record<string, string> = {
  'hoc-tap': 'learning',
  'cong-viec': 'work',
  'viet-lach': 'writing',
  'lap-trinh': 'coding',
  'thiet-ke': 'design',
  'tai-chinh': 'finance',
  'suc-khoe': 'health',
  'gia-dinh': 'family',
  'du-lich': 'travel',
  'nha-cua': 'home',
  'giao-duc-con': 'parenting',
  'phap-ly': 'legal',
  'side-project': 'sideproject',
  'nghien-cuu': 'research',
  'giai-tri': 'entertainment',
};

export function normalizeVariableValue(val: unknown): string {
  if (val === undefined || val === null) return '';
  if (Array.isArray(val)) {
    return val.map((item) => String(item)).join(', ');
  }
  return String(val);
}

export function resolveCanonicalCategoryId(categoryId?: string): string {
  if (!categoryId) return '';
  return CATEGORY_ALIAS_MAP[categoryId] ?? categoryId;
}

export function resolveCategoryInfo(categoryId?: string) {
  const canonicalId = resolveCanonicalCategoryId(categoryId);
  return canonicalId ? CATEGORY_MAP[canonicalId] : undefined;
}

export function resolveCategoryName(categoryId?: string): string {
  if (!categoryId) return '';
  return resolveCategoryInfo(categoryId)?.name ?? categoryId;
}

export function normalizeSearchUrl(url?: string): string {
  if (!url) return '#';
  const skillMatch = url.match(/^\/skills\/[^/]+\/([^/#]+)(#.*)?$/);
  if (skillMatch) {
    return `/skill/${skillMatch[1]}${skillMatch[2] || ''}`;
  }
  return url;
}

export async function copyToClipboardWithFallback(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to execCommand below
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
