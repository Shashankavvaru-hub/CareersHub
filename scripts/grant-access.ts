import 'dotenv/config';
import { db } from '../src/db/index';
import * as schema from '../src/db/schema';
import { desc, eq } from 'drizzle-orm';

async function grantAccess() {
  console.log('Granting the most recently logged-in user admin access to Acme Technologies...');

  // 1. Get the most recently created user
  const latestUsers = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).limit(1);
  if (latestUsers.length === 0) {
    console.error('No users found in the database. Did you sign in?');
    process.exit(1);
  }
  const user = latestUsers[0];
  console.log(`Found user: ${user.email} (Clerk ID: ${user.clerkUserId})`);

  // 2. Get Acme Technologies
  const companies = await db.select().from(schema.companies).where(eq(schema.companies.slug, 'acme-technologies')).limit(1);
  if (companies.length === 0) {
    console.error('Company acme-technologies not found. Did you run the seed script?');
    process.exit(1);
  }
  const company = companies[0];

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
