import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, and, isNull, max } from 'drizzle-orm';
import { requireCompanyRole } from '../../../lib/auth/authorization';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../components/ApplicationShell';
import PageBuilderClient from './PageBuilderClient';

export default async function EditPage({ params }: { params: Promise<{ "company-slug": string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams["company-slug"];

  const [company] = await db.select().from(schema.companies)
    .where(and(eq(schema.companies.slug, slug), eq(schema.companies.status, 'active'), isNull(schema.companies.deletedAt)));
  
  if (!company) {
    notFound();
  }

  const membership = await requireCompanyRole(company.id, ['owner', 'admin', 'editor']);
  const userId = membership.userId;

  // 1. Get or Create Careers Page
  let [careersPage] = await db.select().from(schema.careersPages)
    .where(eq(schema.careersPages.companyId, company.id));

  if (!careersPage) {
    // Sequential fallback for Neon DB
    [careersPage] = await db.insert(schema.careersPages).values({
      companyId: company.id,
    }).returning();
  }

  // 2. Get or Create Draft Revision for this specific user
  let [draftRevision] = await db.select().from(schema.pageRevisions)
    .where(and(
      eq(schema.pageRevisions.careersPageId, careersPage.id),
      eq(schema.pageRevisions.status, 'draft'),
      eq(schema.pageRevisions.createdBy, userId)
    ));

  if (!draftRevision) {
    // Query max version to avoid duplicate key conflicts after a publish
    const [maxVersionRow] = await db.select({ maxVersion: max(schema.pageRevisions.version) })
      .from(schema.pageRevisions)
      .where(eq(schema.pageRevisions.careersPageId, careersPage.id));
    const nextVersion = (maxVersionRow?.maxVersion ?? 0) + 1;

    let themeConfigToCopy = {};
    let sectionsToCopy: any[] = [];

    // Branch off the live page if it exists
    if (careersPage.publishedRevisionId) {
      const [publishedRevision] = await db.select().from(schema.pageRevisions)
        .where(eq(schema.pageRevisions.id, careersPage.publishedRevisionId));
      
      if (publishedRevision) {
        themeConfigToCopy = publishedRevision.themeConfig || {};
        sectionsToCopy = await db.select().from(schema.pageSections)
          .where(eq(schema.pageSections.revisionId, publishedRevision.id))
          .orderBy(schema.pageSections.displayOrder);
      }
    }

    // Insert the new draft for this user
    [draftRevision] = await db.insert(schema.pageRevisions).values({
      careersPageId: careersPage.id,
      version: nextVersion,
      status: 'draft',
      createdBy: userId,
      themeConfig: themeConfigToCopy,
    }).returning();

    // Copy sections into the new draft
    if (sectionsToCopy.length > 0) {
      await db.insert(schema.pageSections).values(
        sectionsToCopy.map(sec => ({
          revisionId: draftRevision.id,
          type: sec.type,
          title: sec.title,
          content: sec.content,
          displayOrder: sec.displayOrder,
        }))
      );
    }
  }

  // 3. Fetch Sections for the draft
  const sections = await db.select().from(schema.pageSections)
    .where(eq(schema.pageSections.revisionId, draftRevision.id))
    .orderBy(schema.pageSections.displayOrder);

  return (
    <ApplicationShell currentCompanyName={company.name}>
      <PageBuilderClient 
        companyId={company.id}
        companySlug={company.slug}
        initialThemeConfig={draftRevision.themeConfig} 
        initialSections={sections} 
      />
    </ApplicationShell>
  );
}
