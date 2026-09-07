import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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