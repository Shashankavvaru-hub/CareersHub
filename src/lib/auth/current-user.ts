import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '../../db';
import * as schema from '../../db/schema';

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get full Clerk user object for email syncing
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('Unauthorized: Clerk user not found');
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    email => email.id === clerkUser.primaryEmailAddressId
  )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error('Clerk user has no email address');
  }

  // Idempotent local user sync
  const [localUser] = await db.insert(schema.users).values({
    clerkUserId: userId,
    email: primaryEmail,
  }).onConflictDoUpdate({
    target: schema.users.clerkUserId,
    set: { email: primaryEmail }
  }).returning();

  return localUser;
}
