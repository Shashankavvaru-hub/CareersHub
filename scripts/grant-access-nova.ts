import 'dotenv/config';
import { db } from '../src/db/index';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function grantAccess() {
  const email = 'alvshashank@gmail.com';
  const companySlug = 'nova-labs';
  
  console.log(`Granting ${email} admin access to ${companySlug}...`);

  // 1. Get the user by email
  const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (users.length === 0) {
    console.error(`User with email ${email} not found. Did you sign in?`);
    process.exit(1);
  }
  const user = users[0];
  console.log(`Found user: ${user.email} (ID: ${user.id})`);

  // 2. Get the company
  const companies = await db.select().from(schema.companies).where(eq(schema.companies.slug, companySlug)).limit(1);
  if (companies.length === 0) {
    console.error(`Company ${companySlug} not found. Did you run the seed script?`);
    process.exit(1);
  }
  const company = companies[0];
  console.log(`Found company: ${company.name} (ID: ${company.id})`);

  // 3. Insert or Update Membership
  await db.insert(schema.companyMemberships).values({
    userId: user.id,
    companyId: company.id,
    role: 'admin',
  }).onConflictDoUpdate({
    target: [schema.companyMemberships.companyId, schema.companyMemberships.userId],
    set: { role: 'admin' }
  });

  console.log(`✅ Success! Granted ${user.email} admin access to ${company.name}.`);
  process.exit(0);
}

grantAccess().catch(console.error);
