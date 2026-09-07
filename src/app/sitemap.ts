import { MetadataRoute } from 'next';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, isNull, and } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the environment variable if set, otherwise fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Fetch all active companies to generate their public careers page URLs
  const activeCompanies = await db.select()
    .from(schema.companies)
    .where(
      and(
        eq(schema.companies.status, 'active'),
        isNull(schema.companies.deletedAt)
      )
    );

  const companyUrls = activeCompanies.map((company) => ({
    url: `${baseUrl}/${company.slug}/careers`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...companyUrls,
  ];
}