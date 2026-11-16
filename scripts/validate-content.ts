#!/usr/bin/env tsx
/**
 * Content Validation Script
 * Validates frontmatter schemas, checks required fields, validates variable types,
 * checks for duplicate IDs/slugs, reports errors.
 * Exit with code 1 on errors.
 */

import fs from 'fs';
import path from 'path';
import matter from 'front-matter';
import { glob } from 'glob';
import { z } from 'zod';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const SKILLS_DIR = path.join(CONTENT_DIR, 'skills');
const RESOURCES_DIR = path.join(CONTENT_DIR, 'resources');

let hasErrors = false;
let errorCount = 0;
let warningCount = 0;

function logError(message: string, file?: string): void {
  hasErrors = true;
  errorCount++;
  const prefix = file ? `[${file}] ` : '';
  console.error(`❌ ${prefix}${message}`);
}

function logWarning(message: string, file?: string): void {
  warningCount++;
  const prefix = file ? `[${file}] ` : '';
  console.warn(`⚠️  ${prefix}${message}`);
}

function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

function logInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

// ============================================================================
// Zod Schemas
// ============================================================================

const variableTypeSchema = z.enum(['text', 'textarea', 'select', 'multiselect', 'number', 'date']);
const difficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);
const promptDifficultySchema = z.enum(['easy', 'medium', 'advanced', 'beginner', 'intermediate']);
const resourceTypeSchema = z.enum(['course', 'paper', 'article', 'video', 'tool', 'newsletter', 'glossary']);
const languageSchema = z.enum(['vi', 'en', 'both']);

const promptVariableSchema = z.object({
  name: z.string().min(1, 'Variable name is required'),
  type: variableTypeSchema,
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
  required: z.boolean().default(false),
  default: z.any().optional(),
  options: z.array(z.any()).optional(),
});

const promptExampleSchema = z.object({
  inputs: z.record(z.any()),
  output: z.string().min(1, 'Example output is required'),
  context: z.string().optional(),
});

const promptSchema = z.object({
  id: z.string().min(1, 'Prompt ID is required'),
  name: z.string().min(1, 'Prompt name is required'),
  description: z.string().min(1, 'Prompt description is required'),
  template: z.string().min(1, 'Prompt template is required'),
  variables: z.array(promptVariableSchema).min(1, 'At least one variable is required'),
  examples: z.array(promptExampleSchema).min(1, 'At least one example is required'),
  tips: z.array(z.string()).optional(),
  difficulty: promptDifficultySchema.default('medium'),
  useCases: z.array(z.string()).min(1, 'At least one use case is required'),
  copiedCount: z.number().int().nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),
});

const agentConversationSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Conversation content is required'),
});

const agentTemplateSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().min(1, 'Agent description is required'),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  tools: z.array(z.string()).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  exampleConversations: z.array(agentConversationSchema).optional(),
});

const skillSchema = z.object({
  id: z.string().min(1, 'Skill ID is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Skill name is required'),
  description: z.string().optional(),
  whenToUse: z.array(z.string()).optional(),
  difficulty: difficultySchema.default('beginner'),
  estimatedTime: z.string().optional(),
  tags: z.array(z.string()).optional(),
  prompts: z.array(promptSchema).optional(),
  agentTemplate: agentTemplateSchema.optional(),
  relatedSkillIds: z.array(z.string()).optional(),
  author: z.string().optional(),
  source: z.string().optional(),
  version: z.string().default('1.0.0'),
  updatedAt: z.string().optional(),
});

const resourceSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  categoryId: z.string().optional(),
  skillId: z.string().optional(),
  type: resourceTypeSchema.default('article'),
  title: z.string().min(1, 'Resource title is required'),
  description: z.string().optional(),
  url: z.string().url('Resource URL must be valid'),
  source: z.string().optional(),
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  free: z.boolean().default(true),
  language: languageSchema.default('vi'),
  tags: z.array(z.string()).optional(),
}).refine(
  (data) => data.categoryId || data.skillId,
  { message: 'Resource must have either categoryId or skillId' }
);

// ============================================================================
// Validation Functions
// ============================================================================

const skillIds = new Set<string>();
const skillSlugs = new Map<string, string>(); // slug -> file
const promptIds = new Set<string>();
const resourceIds = new Set<string>();
const categoryIds = new Set([
  'learning', 'work', 'writing', 'coding', 'design', 'finance', 'health', 'family', 'travel', 'home', 'parenting', 'legal', 'sideproject', 'research', 'entertainment',
  'hoc-tap', 'cong-viec', 'viet-lach', 'lap-trinh', 'thiet-ke', 'tai-chinh', 'suc-khoe', 'gia-dinh', 'du-lich', 'nha-cua', 'giao-duc-con', 'phap-ly', 'side-project', 'nghien-cuu', 'giai-tri'
]);

async function validateSkills(): Promise<void> {
  logInfo('Validating skills...');
  const pattern = path.join(SKILLS_DIR, '**', '*.mdx').replace(/\\/g, '/');
  const files = await glob(pattern, { absolute: true });

  if (files.length === 0) {
    logWarning('No skill files found in src/content/skills/');
    return;
  }

  for (const file of files) {
    const relativePath = path.relative(SKILLS_DIR, file);
    const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const { attributes } = matter(content);

      // Validate with Zod
      const result = skillSchema.safeParse(attributes);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          logError(`Skill validation failed: ${err.path.join('.')} - ${err.message}`, relativePath);
        });
        continue;
      }

      const skill = result.data;

      // Check duplicate IDs
      if (skillIds.has(skill.id)) {
        logError(`Duplicate skill ID: ${skill.id}`, relativePath);
      } else {
        skillIds.add(skill.id);
      }

      // Check duplicate slugs
      if (skillSlugs.has(slug)) {
        logError(`Duplicate skill slug: ${slug} (also in ${skillSlugs.get(slug)})`, relativePath);
      } else {
        skillSlugs.set(slug, relativePath);
      }

      // Validate categoryId exists
      if (!categoryIds.has(skill.categoryId)) {
        logError(`Invalid categoryId: ${skill.categoryId}`, relativePath);
      }

      // Validate prompts
      if (skill.prompts) {
        const skillPromptIds = new Set<string>();
        skill.prompts.forEach((prompt) => {
          if (promptIds.has(prompt.id)) {
            logError(`Duplicate prompt ID across skills: ${prompt.id}`, relativePath);
          } else {
            promptIds.add(prompt.id);
          }

          if (skillPromptIds.has(prompt.id)) {
            logError(`Duplicate prompt ID within skill: ${prompt.id}`, relativePath);
          } else {
            skillPromptIds.add(prompt.id);
          }
        });
      }
    } catch (error) {
      logError(`Failed to parse skill file: ${error}`, relativePath);
    }
  }

  logSuccess(`Validated ${files.length} skill files`);
}

async function validateResources(): Promise<void> {
  logInfo('Validating resources...');
  const pattern = path.join(RESOURCES_DIR, '**', '*.mdx').replace(/\\/g, '/');
  const files = await glob(pattern, { absolute: true });

  if (files.length === 0) {
    logWarning('No resource files found in src/content/resources/');
    return;
  }

  for (const file of files) {
    const relativePath = path.relative(RESOURCES_DIR, file);

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const { attributes } = matter(content);

      const result = resourceSchema.safeParse(attributes);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          logError(`Resource validation failed: ${err.path.join('.')} - ${err.message}`, relativePath);
        });
        continue;
      }

      const resource = result.data;

      // Check duplicate IDs
      if (resourceIds.has(resource.id)) {
        logError(`Duplicate resource ID: ${resource.id}`, relativePath);
      } else {
        resourceIds.add(resource.id);
      }

      // Validate categoryId if provided
      if (resource.categoryId && !categoryIds.has(resource.categoryId)) {
        logError(`Invalid categoryId: ${resource.categoryId}`, relativePath);
      }

      // Validate skillId if provided
      if (resource.skillId && !skillIds.has(resource.skillId)) {
        logWarning(`Referenced skillId not found: ${resource.skillId}`, relativePath);
      }
    } catch (error) {
      logError(`Failed to parse resource file: ${error}`, relativePath);
    }
  }

  logSuccess(`Validated ${files.length} resource files`);
}

async function main(): Promise<void> {
  console.log('🔍 Validating content...\n');

  await validateSkills();
  console.log('');
  await validateResources();

  console.log('\n📊 Summary:');
  console.log(`   Skills:     ${skillIds.size}`);
  console.log(`   Prompts:    ${promptIds.size}`);
  console.log(`   Resources:  ${resourceIds.size}`);
  console.log(`   Errors:     ${errorCount}`);
  console.log(`   Warnings:   ${warningCount}`);

  if (hasErrors) {
    console.log('\n❌ Validation failed with errors!');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n✅ Validation passed with warnings.');
    process.exit(0);
  } else {
    console.log('\n✅ Validation passed!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('\n💥 Validation script crashed:', error);
  process.exit(1);
});