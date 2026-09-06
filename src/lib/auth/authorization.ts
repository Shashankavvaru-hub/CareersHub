import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from './current-user';

export async function getCurrentCompanyMembership(companyId: string) {
  const user = await getCurrentUser();
  const memberships = await db.select().from(schema.companyMemberships)
    .where(and(
      eq(schema.companyMemberships.userId, user.id),
      eq(schema.companyMemberships.companyId, companyId)
    )).limit(1);

  return memberships[0] || null;
}

export async function requireCompanyMembership(companyId: string) {
  const membership = await getCurrentCompanyMembership(companyId);
  if (!membership) {
    throw new Error('Forbidden: Not a member of this company');
  }
  return membership;
}

export async function requireCompanyRole(companyId: string, allowedRoles: ('owner' | 'admin' | 'editor')[]) {
  const membership = await requireCompanyMembership(companyId);
  if (!allowedRoles.includes(membership.role)) {
    throw new Error('Forbidden: Insufficient role permissions');
  }
  return membership;
}
