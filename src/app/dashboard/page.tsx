import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '../../lib/auth/current-user';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ApplicationShell } from '../../components/ApplicationShell';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  const memberships = await db.select({
    company: schema.companies,
    role: schema.companyMemberships.role
  })
  .from(schema.companyMemberships)
  .innerJoin(schema.companies, eq(schema.companies.id, schema.companyMemberships.companyId))
  .where(eq(schema.companyMemberships.userId, user.id));

  if (memberships.length === 0) {
    redirect('/onboarding');
  }

  return (
    <ApplicationShell>
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-extralight font-playfair text-slate-50 tracking-tight mb-10">Your Companies</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {memberships.map((m) => (
            <div key={m.company.id} className="p-8 border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md transition-all hover:border-white/20">
              <h2 className="text-2xl font-light text-slate-50 mb-2">{m.company.name}</h2>
              <p className="text-xs font-mono tracking-wider uppercase text-slate-400 mb-8">Role: <span className="font-semibold text-slate-300 capitalize">{m.role}</span></p>
              <div className="flex gap-4">
                <Link href={`/${m.company.slug}/edit`} className="text-sm font-medium tracking-wide bg-slate-100 hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] text-slate-900 px-5 py-2.5 rounded-full text-center">
                  Manage Careers
                </Link>
                <Link href={`/${m.company.slug}/careers`} target="_blank" className="text-sm font-medium tracking-wide border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors text-slate-300 px-5 py-2.5 rounded-full text-center">
                  View Public
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ApplicationShell>
  );
}
