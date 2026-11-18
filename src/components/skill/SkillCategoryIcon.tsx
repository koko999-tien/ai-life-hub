'use client';

import {
  Baby,
  BookOpen,
  Briefcase,
  Code,
  Gamepad2,
  HeartPulse,
  Home,
  Microscope,
  Palette,
  PenTool,
  Plane,
  Rocket,
  Scale,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { resolveCategoryInfo } from './categoryHelpers';

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  BookOpen,
  Briefcase,
  PenTool,
  Code,
  Palette,
  Wallet,
  HeartPulse,
  Users,
  Plane,
  Home,
  Baby,
  Scale,
  Rocket,
  Microscope,
  Gamepad2,
};

export function SkillCategoryIcon({
  categoryId,
  className = 'w-5 h-5',
}: {
  categoryId: string;
  className?: string;
}) {
  const category = resolveCategoryInfo(categoryId);
  const Icon = (category?.icon && CATEGORY_ICON_MAP[category.icon]) || BookOpen;
  return <Icon className={className} aria-hidden="true" />;
}
