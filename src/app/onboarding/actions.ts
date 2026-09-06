"use server"

import { db } from '../../db';
import * as schema from '../../db/schema';
import { getCurrentUser } from '../../lib/auth/current-user';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function createCompanyAction(formData: FormData) {
  const user = await getCurrentUser();
  
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  if (!name || !slug) {
    throw new Error('Name and slug are required');
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Invalid slug format');
  }

  const existing = await db.select().from(schema.companies).where(eq(schema.companies.slug, slug));
  if (existing.length > 0) {
    throw new Error('Company slug is already taken');
  }

  try {
    // 1. Create company
    const [company] = await db.insert(schema.companies).values({
      name,
      slug,
      status: 'active'
    }).returning();

    // 2. Create Careers Page
    const [careersPage] = await db.insert(schema.careersPages).values({
      companyId: company.id
    }).returning();

    // 3. Create Draft Revision
    const [draft] = await db.insert(schema.pageRevisions).values({
      careersPageId: careersPage.id,
      version: 1,
      status: 'draft',
      createdBy: user.id,
      themeConfig: {}
    }).returning();

    // 4. Update Careers Page with draft
    await db.update(schema.careersPages)
      .set({ currentDraftRevisionId: draft.id })
      .where(eq(schema.careersPages.id, careersPage.id));

    // 5. Create membership
    await db.insert(schema.companyMemberships).values({
      userId: user.id,
      companyId: company.id,
      role: 'owner'
    });
  } catch (error) {
    console.error("Failed to create company", error);
    throw new Error('Failed to create company. Please try again.');
  }

  redirect('/dashboard');
}
