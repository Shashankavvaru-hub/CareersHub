import { db } from './index';
import * as schema from './schema';
import * as fs from 'fs';
import * as path from 'path';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';

async function runSeed() {
  console.log('Seeding Database...');

  // Read sample data
  const seedDataPath = path.resolve(process.cwd(), 'sample_jobs_seed.json');
  if (!fs.existsSync(seedDataPath)) {
    console.error('sample_jobs_seed.json not found!');
    process.exit(1);
  }
  
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  for (const company of seedData.companies) {
    console.log(`Processing company: ${company.name}`);

    // Insert or Update Company
    const [insertedCompany] = await db.insert(schema.companies).values({
      id: company.id,
      name: company.name,
      slug: company.slug,
      status: 'active',
    }).onConflictDoUpdate({
      target: schema.companies.slug,
      set: { name: company.name }
    }).returning();

    const companyId = insertedCompany.id;

    // Insert Fake User for this company
    const clerkId = `seed-recruiter-${company.slug}`;
    const [user] = await db.insert(schema.users).values({
      clerkUserId: clerkId,
      email: `${company.slug}@example.com`,
    }).onConflictDoUpdate({
      target: schema.users.clerkUserId,
      set: { email: `${company.slug}@example.com` }
    }).returning();

    // Insert Membership
    await db.insert(schema.companyMemberships).values({
      companyId: companyId,
      userId: user.id,
      role: 'admin',
    }).onConflictDoNothing();

    // Insert Careers Page (without draft/published references first)
    const [careersPage] = await db.insert(schema.careersPages).values({
      companyId: companyId,
    }).onConflictDoUpdate({
      target: schema.careersPages.companyId,
      set: { companyId: companyId }
    }).returning();

    // Insert Draft Revision
    const [draftRevision] = await db.insert(schema.pageRevisions).values({
      careersPageId: careersPage.id,
      version: 1,
      status: 'draft',
      createdBy: user.id,
      themeConfig: {},
    }).onConflictDoUpdate({
      target: [schema.pageRevisions.careersPageId, schema.pageRevisions.version],
      set: { status: 'draft' }
    }).returning();

    // Insert Published Revision
    const [publishedRevision] = await db.insert(schema.pageRevisions).values({
      careersPageId: careersPage.id,
      version: 2,
      status: 'published',
      createdBy: user.id,
      themeConfig: {},
      publishedAt: new Date().toISOString(),
    }).onConflictDoNothing().returning();

    // Link revisions back to careers_page
    if (publishedRevision) {
      await db.update(schema.careersPages).set({
        currentDraftRevisionId: draftRevision.id,
        publishedRevisionId: publishedRevision.id,
      }).where(eq(schema.careersPages.id, careersPage.id));
    } else {
       await db.update(schema.careersPages).set({
        currentDraftRevisionId: draftRevision.id,
      }).where(eq(schema.careersPages.id, careersPage.id));
    }

    // Insert Sections for Draft
    const sectionTypes: ('about' | 'life_at_company' | 'jobs' | 'our_values' | 'where_we_work' | 'perks')[] = [
      'about', 'life_at_company', 'jobs', 'our_values', 'where_we_work', 'perks'
    ];
    
    let order = 0;
    for (const type of sectionTypes) {
      await db.insert(schema.pageSections).values({
        revisionId: draftRevision.id,
        type: type,
        title: `Seed ${type} section`,
        content: { text: "Seed content" },
        displayOrder: order++,
      }).onConflictDoNothing();
    }
  }

  // Insert Jobs
  console.log(`Processing ${seedData.jobs.length} jobs...`);
  for (const job of seedData.jobs) {
    await db.insert(schema.jobs).values({
      id: job.id,
      companyId: job.company_id,
      title: job.title,
      slug: job.slug,
      description: job.description,
      workPolicy: job.work_policy,
      locations: job.locations,
      department: job.department,
      employmentType: job.employment_type,
      experienceLevel: job.experience_level,
      jobType: job.job_type,
      salaryRange: job.salary_range,
      status: job.status,
      applicationUrl: job.application_url,
      datePosted: new Date(job.date_posted).toISOString(),
      validThrough: job.valid_through ? new Date(job.valid_through).toISOString() : null,
    }).onConflictDoUpdate({
      target: [schema.jobs.companyId, schema.jobs.slug],
      set: { title: job.title }
    });
  }

  console.log('Seed completed successfully!');
}

runSeed().catch((e) => {
  console.error(e);
  process.exit(1);
});
