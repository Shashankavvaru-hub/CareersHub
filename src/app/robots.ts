import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://careershub-blond.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/login/', 
        '/onboarding/', 
        '/*/edit/' // Disallows page builder routes like /orbit-systems/edit/
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}