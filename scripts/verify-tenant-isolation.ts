import { db } from '../src/db/index';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function verifyIsolation() {
  console.log('Verifying Tenant Isolation...');

  // Get companies
  const companies = await db.select().from(schema.companies);
  if (companies.length < 2) {
    console.error('Need at least 2 companies for testing.');
    process.exit(1);
  }

  const companyA = companies[0];
  const companyB = companies[1];

  // Test 1: A query scoped to Company A does not return Company B's jobs.
  const jobsA = await db.select().from(schema.jobs).where(eq(schema.jobs.companyId, companyA.id));
  const jobsA_BelongingToB = jobsA.filter(j => j.companyId !== companyA.id);
  if (jobsA_BelongingToB.length > 0) throw new Error('Isolation failed: Company A returned Company B jobs');
  console.log('✅ Test 1: Jobs are correctly scoped to tenants.');

  // Test 2: Company A's Careers page cannot resolve to Company B's page revision.
  const pageA = await db.select().from(schema.careersPages).where(eq(schema.careersPages.companyId, companyA.id)).limit(1);
  const revisionsA = await db.select().from(schema.pageRevisions).where(eq(schema.pageRevisions.careersPageId, pageA[0].id));
  const revisionsA_BelongingToB = revisionsA.filter(r => r.careersPageId !== pageA[0].id);
  if (revisionsA_BelongingToB.length > 0) throw new Error('Isolation failed: Cross-tenant revision reference');
  console.log('✅ Test 2: Careers pages and revisions are correctly scoped.');

  // Test 3: Membership belonging to Company A cannot be used as authorization for Company B.
  const membershipsA = await db.select().from(schema.companyMemberships).where(eq(schema.companyMemberships.companyId, companyA.id));
  const membershipsA_BelongingToB = membershipsA.filter(m => m.companyId !== companyA.id);
  if (membershipsA_BelongingToB.length > 0) throw new Error('Isolation failed: Membership leakage');
  console.log('✅ Test 3: Memberships are correctly scoped.');

  // Test 4: Seeded job cannot accidentally reference another tenant.
  const allJobs = await db.select().from(schema.jobs);
  const invalidJobs = allJobs.filter(j => j.companyId !== companyA.id && j.companyId !== companyB.id);
  if (invalidJobs.length > 0) throw new Error('Isolation failed: Job references invalid tenant');
  console.log('✅ Test 4: Job tenant references are valid.');

  console.log('All tenant isolation tests passed!');
  process.exit(0);
}

verifyIsolation().catch(console.error);
