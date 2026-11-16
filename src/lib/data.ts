import { promises as fs } from 'fs';
import path from 'path';
import matter from 'front-matter';
import { Category, Skill, Resource, SearchResult } from '@/types';
import { CATEGORIES } from '@/lib/constants';

export type { Category, Skill, Resource, SearchResult };

export const skills: Skill[] = [];

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

const categoryAliasMap: Record<string, string> = {
  'prompt-engineering': 'prompt-engineering',
  learning: 'hoc-tap',
  work: 'cong-viec',
  writing: 'viet-lach',
  coding: 'lap-trinh',
  design: 'thiet-ke',
  finance: 'tai-chinh',
  health: 'suc-khoe',
  family: 'gia-dinh',
  travel: 'du-lich',
  home: 'nha-cua',
  parenting: 'giao-duc-con',
  legal: 'phap-ly',
  sideproject: 'side-project',
  research: 'nghien-cuu',
  entertainment: 'giai-tri',
};

const reverseAliasMap: Record<string, string> = Object.fromEntries(
  Object.entries(categoryAliasMap).map(([en, vi]) => [vi, en])
);

export function getFeaturedCategories(): Category[] {
  return CATEGORIES.map((c) => ({
    ...c,
    skillCount: 5,
    promptCount: 15,
    agentCount: 2,
    resourceCount: 12,
    slug: c.id,
  }));
}

async function readDirectory(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await readDirectory(fullPath)));
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
    return files;
  } catch {
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const allSkills = await getAllSkills();
    const allResources = await getAllResources();

    return CATEGORIES.map((cat) => {
      const targetVi = categoryAliasMap[cat.id] || cat.id;
      const catSkills = allSkills.filter(
        (s) => s.categoryId === cat.id || s.categoryId === targetVi
      );
      const catResources = allResources.filter(
        (r) => r.categoryId === cat.id || r.categoryId === targetVi
      );
      const promptCount = catSkills.reduce((acc, s) => acc + (s.prompts?.length || 0), 0);
      const agentCount = catSkills.filter((s) => Boolean(s.agentTemplate)).length;

      return {
        ...cat,
        skillCount: catSkills.length,
        promptCount: promptCount > 0 ? promptCount : 5,
        agentCount: agentCount > 0 ? agentCount : 1,
        resourceCount: catResources.length,
        slug: cat.id,
      };
    });
  } catch {
    return CATEGORIES.map((c) => ({
      ...c,
      skillCount: 5,
      promptCount: 15,
      agentCount: 2,
      resourceCount: 12,
      slug: c.id,
    }));
  }
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getAllCategories();
  const targetEn = reverseAliasMap[slug] || slug;
  const targetVi = categoryAliasMap[slug] || slug;
  return categories.find(
    (c) => c.slug === slug || c.id === slug || c.id === targetEn || c.id === targetVi
  );
}

export async function getSkill(slug: string): Promise<Skill | undefined> {
  const allSkills = await getAllSkills();
  return allSkills.find((s) => s.slug === slug || s.id === slug);
}

export async function getAllSkills(): Promise<Skill[]> {
  try {
    const contentFiles = await readDirectory(path.join(CONTENT_DIR, 'skills'));
    const skillsList: Skill[] = [];

    for (const file of contentFiles) {
      try {
        const raw = await fs.readFile(file, 'utf-8');
        const parsed = matter<any>(raw);
        const attr = parsed.attributes || {};
        const filename = path.basename(file, '.mdx');
        const id = attr.id || filename;
        const categoryId = attr.categoryId || path.basename(path.dirname(file));
        const slug = filename;

        skillsList.push({
          id,
          categoryId,
          name: attr.name || filename.replace(/-/g, ' '),
          description: attr.description || '',
          whenToUse: attr.whenToUse || [],
          difficulty: attr.difficulty || 'beginner',
          estimatedTime: attr.estimatedTime || '15 phút',
          tags: attr.tags || [],
          prompts: attr.prompts || [],
          agentTemplate: attr.agentTemplate,
          relatedSkillIds: attr.relatedSkillIds || [],
          author: attr.author,
          source: attr.source,
          version: attr.version || '1.0.0',
          updatedAt: attr.updatedAt || new Date().toISOString().slice(0, 10),
          slug,
        });
      } catch (err) {
        console.error('Error loading skill:', file, err);
      }
    }
    return skillsList;
  } catch {
    return [];
  }
}

export async function getSkillsByCategory(categoryId: string): Promise<Skill[]> {
  const allSkills = await getAllSkills();
  const targetVi = categoryAliasMap[categoryId] || categoryId;
  const targetEn = reverseAliasMap[categoryId] || categoryId;
  return allSkills.filter(
    (s) =>
      s.categoryId === categoryId ||
      s.categoryId === targetVi ||
      s.categoryId === targetEn ||
      (categoryId === 'prompt-engineering' &&
        (s.tags?.some((t) => t.includes('prompt') || t.includes('cot') || t.includes('agent')) ||
          (s.prompts && s.prompts.length > 0)))
  );
}

export async function getAllResources(): Promise<Resource[]> {
  try {
    const contentFiles = await readDirectory(path.join(CONTENT_DIR, 'resources'));
    const resourcesList: Resource[] = [];

    for (const file of contentFiles) {
      try {
        const raw = await fs.readFile(file, 'utf-8');
        const parsed = matter<any>(raw);
        const attr = parsed.attributes || {};
        const filename = path.basename(file, '.mdx');
        const id = attr.id || filename;
        const categoryId = attr.categoryId || path.basename(path.dirname(file));

        resourcesList.push({
          id,
          categoryId,
          type: attr.type || 'tool',
          title: attr.title || filename.replace(/-/g, ' '),
          description: attr.description || '',
          url: attr.url || '#',
          source: attr.source || '',
          free: attr.free ?? true,
          language: attr.language || 'vi',
          tags: attr.tags || [],
        });
      } catch (err) {
        console.error('Error loading resource:', file, err);
      }
    }
    return resourcesList;
  } catch {
    return [];
  }
}

export async function getResourcesByCategory(categoryId: string): Promise<Resource[]> {
  const allResources = await getAllResources();
  const targetVi = categoryAliasMap[categoryId] || categoryId;
  const targetEn = reverseAliasMap[categoryId] || categoryId;
  return allResources.filter(
    (r) =>
      r.categoryId === categoryId ||
      r.categoryId === targetVi ||
      r.categoryId === targetEn ||
      (categoryId === 'prompt-engineering' &&
        r.tags?.some((t) => t.includes('prompt') || t.includes('llm') || t.includes('ai')))
  );
}

export async function getAllPrompts(): Promise<SearchResult[]> {
  const allSkills = await getAllSkills();
  const prompts: SearchResult[] = [];
  allSkills.forEach((skill) => {
    skill.prompts?.forEach((p) => {
      prompts.push({
        id: p.id,
        type: 'prompt',
        title: p.name,
        description: p.description,
        categoryId: skill.categoryId,
        skillId: skill.id,
        tags: skill.tags,
        url: `/skill/${skill.slug}#${p.id}`,
      });
    });
  });
  return prompts;
}

export async function getAllSearchables(): Promise<SearchResult[]> {
  const categories = await getAllCategories();
  const results: SearchResult[] = [];

  categories.forEach((category) => {
    results.push({
      id: category.id,
      type: 'category',
      title: category.name,
      description: category.description,
      tags: [category.id],
      url: `/category/${category.slug}`,
    });
  });

  const allSkills = await getAllSkills();
  allSkills.forEach((skill) => {
    results.push({
      id: skill.id,
      type: 'skill',
      title: skill.name,
      description: skill.description,
      tags: skill.tags,
      url: `/skill/${skill.slug}`,
    });
  });

  const allResources = await getAllResources();
  allResources.forEach((resource) => {
    results.push({
      id: resource.id,
      type: 'resource',
      title: resource.title,
      description: resource.description,
      tags: resource.tags,
      url: resource.url,
    });
  });

  return results;
}
