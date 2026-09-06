import 'dotenv/config';
import { db } from '../src/db/index';
import * as schema from '../src/db/schema';
import { desc, eq } from 'drizzle-orm';

async function verifyDb() {
  console.log("--- DB Verification ---");
  
  // 1. Get the most recently created company
  const latestCompanies = await db.select().from(schema.companies).orderBy(desc(schema.companies.createdAt)).limit(1);
  if (latestCompanies.length === 0) {
    console.log("No companies found.");
    return;
  }
  const company = latestCompanies[0];
  console.log(`\n🏢 Latest Company: ${company.name} (Slug: ${company.slug})`);

  // 2. Get membership for this company
  const memberships = await db.select({
    role: schema.companyMemberships.role,
    userEmail: schema.users.email
  })
  .from(schema.companyMemberships)
  .innerJoin(schema.users, eq(schema.users.id, schema.companyMemberships.userId))
  .where(eq(schema.companyMemberships.companyId, company.id));

  console.log(`\n👥 Memberships:`);
  memberships.forEach(m => console.log(` - ${m.userEmail} [Role: ${m.role}]`));

  // 3. Get careers page and revisions
  const pages = await db.select().from(schema.careersPages).where(eq(schema.careersPages.companyId, company.id));
  if (pages.length > 0) {
    const page = pages[0];
    console.log(`\n📄 Careers Page Created (ID: ${page.id})`);
    
    const drafts = await db.select().from(schema.pageRevisions).where(eq(schema.pageRevisions.careersPageId, page.id));
    console.log(`   Revisions: ${drafts.length} found (Status: ${drafts[0]?.status})`);
  } else {
    console.log(`\n❌ No Careers Page found for this company.`);
  }

  process.exit(0);
}

verifyDb().catch(console.error);
