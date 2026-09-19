"use server";

import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, and, max } from 'drizzle-orm';
import { requireCompanyRole } from '../../../lib/auth/authorization';
import { revalidatePath } from 'next/cache';

export type ThemeConfig = {
  presetTheme?: string;
  logoUrl?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  heroImageUrl?: string;
  heroOverlayColor?: string;
  heroOverlayOpacity?: string;
  ctaText?: string;
  ctaUrl?: string;
  cultureVideoUrl?: string;
};

export type SectionData = {
  id: string; // client-side temp id or real uuid
  type: typeof schema.sectionTypeEnum.enumValues[number];
  title: string;
  content: Record<string, any>;
  displayOrder: number;
};

// Helper to validate culture video URLs (MVP Rule 11)
function validateVideoUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Allow YouTube
    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'youtu.be') {
      return url;
    }
    
    // Allow Vimeo
    if (hostname === 'vimeo.com' || hostname === 'www.vimeo.com' || hostname === 'player.vimeo.com') {
      return url;
    }
    
    throw new Error('Unsupported video provider. Please use YouTube or Vimeo.');
  } catch (error: any) {
    throw new Error(error.message || 'Invalid video URL.');
  }
}

export async function saveDraftAction(
  companyId: string, 
  themeConfig: ThemeConfig, 
  sections: SectionData[]
) {
  // 1. Authorize
  const membership = await requireCompanyRole(companyId, ['owner', 'admin', 'editor']);
  const userId = membership.userId;

  // 2. Get Careers Page
  const [careersPage] = await db.select()
    .from(schema.careersPages)
    .where(eq(schema.careersPages.companyId, companyId));

  if (!careersPage) {
    throw new Error("Careers page not found. Please reload the page.");
  }

  // 3. Get Draft Revision for this specific user
  let [draftRevision] = await db.select()
    .from(schema.pageRevisions)
    .where(and(
      eq(schema.pageRevisions.careersPageId, careersPage.id),
      eq(schema.pageRevisions.status, 'draft'),
      eq(schema.pageRevisions.createdBy, userId)
    ));

  if (!draftRevision) {
    throw new Error("Draft revision not found.");
  }

  // 4. Since neon-http driver doesn't support complex transactions in edge runtime, 
  // we perform sequential queries as per project constraints.
  
  // Validate Video URL
  if (themeConfig.cultureVideoUrl) {
    themeConfig.cultureVideoUrl = validateVideoUrl(themeConfig.cultureVideoUrl);
  }

  // Update Theme Config
  await db.update(schema.pageRevisions)
    .set({ themeConfig: themeConfig as any, updatedAt: new Date().toISOString() })
    .where(eq(schema.pageRevisions.id, draftRevision.id));

  // Delete existing draft sections
  await db.delete(schema.pageSections)
    .where(eq(schema.pageSections.revisionId, draftRevision.id));

  // Insert new sections
  if (sections.length > 0) {
    const newSections = sections.map((s, index) => ({
      revisionId: draftRevision.id,
      type: s.type,
      title: s.title,
      content: s.content,
      displayOrder: index, // Ensure order matches array
    }));
    await db.insert(schema.pageSections).values(newSections);
  }

  return { success: true };
}

export async function publishAction(companyId: string, companySlug: string) {
  // 1. Authorize
  const membership = await requireCompanyRole(companyId, ['owner', 'admin', 'editor']);
  const userId = membership.userId;

  // 2. Get Careers Page
  const [careersPage] = await db.select()
    .from(schema.careersPages)
    .where(eq(schema.careersPages.companyId, companyId));

  if (!careersPage) {
    throw new Error("Careers page not found.");
  }

  // 3. Get Draft Revision for this specific user
  const [draftRevision] = await db.select()
    .from(schema.pageRevisions)
    .where(and(
      eq(schema.pageRevisions.careersPageId, careersPage.id),
      eq(schema.pageRevisions.status, 'draft'),
      eq(schema.pageRevisions.createdBy, userId)
    ));

  if (!draftRevision) {
    throw new Error("No draft to publish.");
  }

  const now = new Date().toISOString();

  // 4. Sequential Publishing Flow

  // Archive currently published revisions
  await db.update(schema.pageRevisions)
    .set({ status: 'archived', updatedAt: now })
    .where(and(
      eq(schema.pageRevisions.careersPageId, careersPage.id),
      eq(schema.pageRevisions.status, 'published')
    ));

  // Promote Draft to Published
  await db.update(schema.pageRevisions)
    .set({ status: 'published', publishedAt: now, updatedAt: now })
    .where(eq(schema.pageRevisions.id, draftRevision.id));

  // Update Careers Page Pointer
  await db.update(schema.careersPages)
    .set({ publishedRevisionId: draftRevision.id })
    .where(eq(schema.careersPages.id, careersPage.id));

  revalidatePath(`/${companySlug}/edit`);
  revalidatePath(`/${companySlug}/careers`);

  return { success: true };
}
