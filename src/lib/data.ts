import { promises as fs } from 'fs';
import path from 'path';
import { Category, Skill, Resource, SearchResult } from '@/types';
import { CATEGORIES } from '@/lib/constants';

export type { Category, Skill, Resource, SearchResult };

export const skills: Skill[] = [];

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

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
    const contentFiles = await readDirectory(path.join(CONTENT_DIR, 'categories'));
    const categories: Category[] = contentFiles.map((file) => {
      // Simplified loading - in real implementation use front-matter parser
      return {
        id: path.basename(file, '.mdx').replace(/-/g, '-'),
        name: path.basename(file, '.mdx').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        description: '',
        icon: 'BookOpen',
        color: '#3B82F6',
        skillCount: 5,
        promptCount: 15,
        agentCount: 2,
        resourceCount: 12,
        slug: path.basename(file, '.mdx').replace(/-/g, '-'),
      };
    });
    return categories;
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
  return categories.find((c) => c.slug === slug || c.id === slug);
}

export async function getSkill(slug: string): Promise<Skill | undefined> {
  const allSkills = await getAllSkills();
  return allSkills.find((s) => s.slug === slug || s.id === slug);
}

export async function getAllSkills(): Promise<Skill[]> {
  try {
    const contentFiles = await readDirectory(path.join(CONTENT_DIR, 'skills'));
    const skills: Skill[] = contentFiles
      .filter((f) => !f.includes('/categories/'))
      .map((file) => ({
        id: path.basename(file, '.mdx').replace(/-/g, '-'),
        categoryId: path.basename(path.dirname(file)).replace(/-/g, '-'),
        name: path.basename(file, '.mdx').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        description: '',
        whenToUse: [],
        difficulty: 'beginner',
        estimatedTime: '10-15 phút',
        tags: [],
        prompts: [],
        relatedSkillIds: [],
        version: '1.0.0',
        updatedAt: new Date().toISOString().slice(0, 10),
        slug: path.basename(file, '.mdx').replace(/-/g, '-'),
      }));
    return skills;
  } catch {
    return [];
  }
}

export async function getSkillsByCategory(categoryId: string): Promise<Skill[]> {
  const skills = await getAllSkills();
  return skills.filter((s) => s.categoryId === categoryId);
}

export async function getAllResources(): Promise<Resource[]> {
  try {
    const contentFiles = await readDirectory(path.join(CONTENT_DIR, 'resources'));
    const resources: Resource[] = contentFiles
      .filter((f) => f.includes('/resources/'))
      .map((file) => {
        const id = path.basename(file, '.mdx').replace(/-/g, '-');
        return {
          id,
          type: 'tool' as const,
          title: id,
          description: '',
          url: '',
          source: '',
          free: true,
          language: 'vi' as const,
          tags: [],
        };
      });
    return resources;
  } catch {
    return [];
  }
}

export async function getResourcesByCategory(categoryId: string): Promise<Resource[]> {
  const resources = await getAllResources();
  return resources.filter((r) => r.categoryId === categoryId);
}

export async function getAllPrompts(): Promise<SearchResult[]> {
  const resources = await getAllResources();
  const prompts: SearchResult[] = [];
  resources.forEach((resource) => {
    prompts.push({
      id: resource.id,
      type: 'prompt',
      title: resource.title,
      description: resource.description,
      tags: resource.tags,
      url: `/resource/${resource.id}`,
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

  const skills = await getAllSkills();
  skills.forEach((skill) => {
    results.push({
      id: skill.id,
      type: 'skill',
      title: skill.name,
      description: skill.description,
      tags: skill.tags,
      url: `/skill/${skill.slug}`,
    });
  });

  const resources = await getAllResources();
  resources.forEach((resource) => {
    results.push({
      id: resource.id,
      type: 'resource',
      title: resource.title,
      description: resource.description,
      tags: resource.tags,
      url: `/resource/${resource.id}`,
    });
  });

  return results;
}
