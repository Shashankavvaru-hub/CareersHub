import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PublicPageRenderer from '../../../components/careers-page/PublicPageRenderer';

export async function generateMetadata({ params }: { params: Promise<{ "company-slug": string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams["company-slug"];

  const [company] = await db.select().from(schema.companies)
    .where(and(eq(schema.companies.slug, slug), eq(schema.companies.status, 'active'), isNull(schema.companies.deletedAt)));
  
  if (!company) {
    return { title: 'Careers - Not Found' };
  }

  const [careersPage] = await db.select().from(schema.careersPages)
    .where(eq(schema.careersPages.companyId, company.id));

  if (!careersPage || !careersPage.publishedRevisionId) {
    return { title: `${company.name} Careers` };
  }

  const [publishedRevision] = await db.select().from(schema.pageRevisions)
    .where(eq(schema.pageRevisions.id, careersPage.publishedRevisionId));

  const theme = (publishedRevision?.themeConfig as any) || {};

  return {
    title: theme.heroHeadline ? `${theme.heroHeadline} - ${company.name} Careers` : `Careers at ${company.name}`,
    description: theme.heroSubtext || `Join the team at ${company.name}. View our open positions and learn about our company culture.`,
    openGraph: {
      title: `Careers at ${company.name}`,
      images: theme.heroImageUrl ? [theme.heroImageUrl] : [],
    }
  };
}

export default async function CareersPage({ params }: { params: Promise<{ "company-slug": string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams["company-slug"];

  const [company] = await db.select().from(schema.companies)
    .where(and(eq(schema.companies.slug, slug), eq(schema.companies.status, 'active'), isNull(schema.companies.deletedAt)));
  
  if (!company) {
    notFound();
  }

  // Get Careers Page
  const [careersPage] = await db.select().from(schema.careersPages)
    .where(eq(schema.careersPages.companyId, company.id));

  if (!careersPage || !careersPage.publishedRevisionId) {
    notFound();
  }

  // Get Published Revision
  const [publishedRevision] = await db.select().from(schema.pageRevisions)
    .where(eq(schema.pageRevisions.id, careersPage.publishedRevisionId));

  if (!publishedRevision) {
    notFound();
  }

  // Fetch sections
  const sections = await db.select().from(schema.pageSections)
    .where(eq(schema.pageSections.revisionId, publishedRevision.id))
    .orderBy(schema.pageSections.displayOrder);

  // Fetch active jobs
  const openJobs = await db.select().from(schema.jobs)
    .where(and(eq(schema.jobs.companyId, company.id), eq(schema.jobs.status, 'open')));

  return (
    <PublicPageRenderer 
      companyName={company.name} 
      themeConfig={publishedRevision.themeConfig as any} 
      sections={sections} 
      jobs={openJobs} 
    />
  );
}
