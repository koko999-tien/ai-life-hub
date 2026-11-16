import { MetadataRoute } from 'next';
import { getAllCategories, getAllSkills, getAllResources } from '@/lib/data';

const baseUrl = 'https://ai-life-hub.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/category`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const categoryUrls: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const skillUrls: MetadataRoute.Sitemap = getAllSkills().map((skill) => ({
    url: `${baseUrl}/skill/${skill.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const resourceUrls: MetadataRoute.Sitemap = getAllResources().map((res) => ({
    url: `${baseUrl}/resources/${res.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...categoryUrls, ...skillUrls, ...resourceUrls];
}