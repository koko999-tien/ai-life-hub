import { MetadataRoute } from 'next';
import { getAllCategories, getAllSkills, getAllResources } from '@/lib/data';

const baseUrl = 'https://ai-life-hub.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/category`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const categories = await getAllCategories();
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const skills = await getAllSkills();
  const skillUrls: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${baseUrl}/skill/${skill.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const resources = await getAllResources();
  const resourceUrls: MetadataRoute.Sitemap = resources.map((res) => ({
    url: `${baseUrl}/resources/${res.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...categoryUrls, ...skillUrls, ...resourceUrls];
}