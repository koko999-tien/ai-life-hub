#!/usr/bin/env tsx
/**
 * Build Search Index Script
 * Reads all MDX files, creates SearchDocument[] for each skill, prompt, agent, resource, category.
 * Writes public/search-index.json. Run at build time (postbuild script).
 */

import fs from 'fs';
import path from 'path';
import matter from 'front-matter';
import { glob } from 'glob';
import lunr, { Index } from 'lunr';
import type { SearchDocument, SearchIndex } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const SKILLS_DIR = path.join(CONTENT_DIR, 'skills');
const RESOURCES_DIR = path.join(CONTENT_DIR, 'resources');
const OUTPUT_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'search-index.json');

import {
  CATEGORIES,
  CATEGORY_MAP,
} from '@/lib/constants';

interface SkillFrontMatter {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  whenToUse?: string[];
  difficulty?: string;
  estimatedTime?: string;
  tags?: string[];
  prompts?: PromptFrontMatter[];
  agentTemplate?: {
    name: string;
    description: string;
    systemPrompt: string;
    tools?: string[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    exampleConversations?: Array<{ role: 'user' | 'assistant'; content: string }>;
  };
  relatedSkillIds?: string[];
  author?: string;
  source?: string;
  version?: string;
  updatedAt?: string;
}

interface PromptFrontMatter {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: Array<{
    name: string;
    type: string;
    label: string;
    description?: string;
    required: boolean;
    default?: string;
    options?: string[];
  }>;
  examples: Array<{
    inputs: Record<string, string>;
    output: string;
    context?: string;
  }>;
  tips?: string[];
  difficulty?: string;
  useCases?: string[];
  copiedCount?: number;
  rating?: number;
}

interface ResourceFrontMatter {
  id: string;
  categoryId?: string;
  skillId?: string;
  type?: string;
  title: string;
  description?: string;
  url: string;
  source?: string;
  difficulty?: string;
  duration?: string;
  free?: boolean;
  language?: 'vi' | 'en' | 'both';
  tags?: string[];
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/>\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .trim();
}

async function loadSkills(): Promise<Array<{ skill: SkillFrontMatter; slug: string; content: string }>> {
  const pattern = path.join(SKILLS_DIR, '**', '*.mdx').replace(/\\/g, '/');
  const files = await glob(pattern, { absolute: true });

  const results = [];

  for (const file of files) {
    try {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const { attributes, body } = matter<SkillFrontMatter>(fileContent);

      const relativePath = path.relative(SKILLS_DIR, file);
      const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

      if (!attributes.id || !attributes.name || !attributes.categoryId) {
        console.warn(`⚠️  Skill missing required fields: ${file}`);
        continue;
      }

      results.push({ skill: attributes, slug, content: body });
    } catch (error) {
      console.error(`❌ Error loading skill from ${file}:`, error);
    }
  }

  return results;
}

async function loadResources(): Promise<Array<{ resource: ResourceFrontMatter; slug: string }>> {
  const pattern = path.join(RESOURCES_DIR, '**', '*.mdx').replace(/\\/g, '/');
  const files = await glob(pattern, { absolute: true });

  const results = [];

  for (const file of files) {
    try {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const { attributes } = matter<ResourceFrontMatter>(fileContent);

      const relativePath = path.relative(RESOURCES_DIR, file);
      const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

      if (!attributes.id || !attributes.title || !attributes.url) {
        console.warn(`⚠️  Resource missing required fields: ${file}`);
        continue;
      }

      results.push({ resource: attributes, slug });
    } catch (error) {
      console.error(`❌ Error loading resource from ${file}:`, error);
    }
  }

  return results;
}

function buildSearchDocuments(
  skills: Array<{ skill: SkillFrontMatter; slug: string; content: string }>,
  resources: Array<{ resource: ResourceFrontMatter; slug: string }>
): SearchDocument[] {
  const documents: SearchDocument[] = [];

  // Add categories
  CATEGORIES.forEach((cat) => {
    documents.push({
      id: `category:${cat.id}`,
      type: 'category',
      title: cat.name,
      content: cat.description,
      tags: [cat.id],
      url: `/categories/${cat.id}`,
      boost: 10,
    });
  });

  // Add skills
  skills.forEach(({ skill, slug }) => {
    // Main skill document
    documents.push({
      id: `skill:${skill.id}`,
      type: 'skill',
      title: skill.name,
      content: `${skill.description || ''} ${skill.whenToUse?.join(' ') || ''} ${skill.tags?.join(' ') || ''}`,
      categoryId: skill.categoryId,
      skillId: skill.id,
      tags: skill.tags || [],
      url: `/skills/${slug}`,
      boost: 8,
    });

    // Prompts as separate documents
    skill.prompts?.forEach((prompt) => {
      const variableLabels = prompt.variables?.map((v) => v.label).join(' ') || '';
      const useCases = prompt.useCases?.join(' ') || '';
      const exampleOutputs = prompt.examples?.map((ex) => ex.output).join(' ') || '';

      documents.push({
        id: `prompt:${prompt.id}`,
        type: 'prompt',
        title: prompt.name,
        content: `${prompt.description || ''} ${prompt.template || ''} ${variableLabels} ${useCases} ${exampleOutputs}`,
        categoryId: skill.categoryId,
        skillId: skill.id,
        tags: [...(skill.tags || []), ...(((prompt as any).tags as string[]) || [])],
        url: `/skills/${slug}#prompt-${prompt.id}`,
        boost: 6,
      });
    });

    // Agent template if exists
    if (skill.agentTemplate) {
      const tools = skill.agentTemplate.tools?.join(' ') || '';
      const examples = skill.agentTemplate.exampleConversations?.map((c) => c.content).join(' ') || '';

      documents.push({
        id: `agent:${skill.id}`,
        type: 'agent',
        title: skill.agentTemplate.name,
        content: `${skill.agentTemplate.description || ''} ${skill.agentTemplate.systemPrompt || ''} ${tools} ${examples}`,
        categoryId: skill.categoryId,
        skillId: skill.id,
        tags: skill.tags || [],
        url: `/skills/${slug}#agent`,
        boost: 5,
      });
    }
  });

  // Add resources
  resources.forEach(({ resource, slug }) => {
    documents.push({
      id: `resource:${resource.id}`,
      type: 'resource',
      title: resource.title,
      content: `${resource.description || ''} ${resource.source || ''} ${resource.tags?.join(' ') || ''}`,
      categoryId: resource.categoryId,
      skillId: resource.skillId,
      tags: resource.tags || [],
      url: resource.url,
      boost: 4,
      resourceType: resource.type,
      description: resource.description,
    } as any);
  });

  return documents;
}

function buildLunrIndex(documents: SearchDocument[]): Index {
  const idx = lunr(function (this: lunr.Builder) {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('content', { boost: 5 });
    this.field('tags', { boost: 3 });
    this.field('categoryId', { boost: 2 });
    this.field('skillId', { boost: 2 });

    documents.forEach((doc) => {
      this.add({
        id: doc.id,
        title: doc.title || '',
        content: doc.content || '',
        tags: doc.tags?.join(' ') || '',
        categoryId: doc.categoryId || '',
        skillId: doc.skillId || '',
      });
    });
  });

  return idx;
}

async function main(): Promise<void> {
  console.log('🔍 Building search index...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load content
  console.log('📖 Loading skills...');
  const skills = await loadSkills();
  console.log(`   Found ${skills.length} skills`);

  console.log('📖 Loading resources...');
  const resources = await loadResources();
  console.log(`   Found ${resources.length} resources`);

  // Build search documents
  console.log('\n📝 Building search documents...');
  const documents = buildSearchDocuments(skills, resources);
  console.log(`   Created ${documents.length} search documents`);

  // Build Lunr index
  console.log('\n🔨 Building Lunr index...');
  const index = buildLunrIndex(documents);
  console.log('   Index built successfully');

  // Create search index object
  const searchIndex: SearchIndex = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    documents,
    index: index.toJSON() as SearchIndex['index'],
  };

  // Write to file
  console.log(`\n💾 Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));

  // Stats
  const stats = {
    categories: documents.filter((d) => d.type === 'category').length,
    skills: documents.filter((d) => d.type === 'skill').length,
    prompts: documents.filter((d) => d.type === 'prompt').length,
    agents: documents.filter((d) => d.type === 'agent').length,
    resources: documents.filter((d) => d.type === 'resource').length,
    total: documents.length,
  };

  console.log('\n✅ Search index built successfully!');
  console.log('\n📊 Statistics:');
  console.log(`   Categories: ${stats.categories}`);
  console.log(`   Skills:     ${stats.skills}`);
  console.log(`   Prompts:    ${stats.prompts}`);
  console.log(`   Agents:     ${stats.agents}`);
  console.log(`   Resources:  ${stats.resources}`);
  console.log(`   Total:      ${stats.total}`);
  console.log(`\n📁 Output: ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
});