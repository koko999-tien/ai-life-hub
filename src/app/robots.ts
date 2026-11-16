import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/private/', '/admin/'],
    },
    sitemap: 'https://ai-life-hub.vercel.app/sitemap.xml',
    host: 'https://ai-life-hub.vercel.app',
  };
}