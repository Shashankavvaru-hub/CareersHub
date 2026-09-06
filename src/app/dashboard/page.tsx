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

  const totalCompanies = memberships.length;
  const adminAccessCount = memberships.filter(m => m.role === 'admin' || m.role === 'owner').length;

  return (
    <ApplicationShell>
      <div className="p-8 lg:px-12 w-full">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-4 block">Recruiter Dashboard</span>
            <h1 className="text-5xl lg:text-6xl font-playfair font-extralight tracking-tight text-slate-50 mb-8 leading-[1.1]">
              Great hires start with great clarity.
            </h1>
            <div className="pl-6 border-l-2 border-indigo-500/50">
              <p className="text-lg text-slate-300 italic mb-2">"I hire people brighter than me and I get out of their way."</p>
              <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">— Lee Iacocca</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-rows-2 gap-4">
            {/* Stat Card 1 */}
            <div className="p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 mb-2">Total Companies</p>
                <p className="text-5xl font-light text-slate-50">{totalCompanies}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center">
                <span className="text-2xl opacity-50">🏢</span>
              </div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="p-8 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 mb-2">Admin Access</p>
                <p className="text-5xl font-light text-slate-50">{adminAccessCount}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center">
                <span className="text-2xl opacity-50">🔑</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-extralight font-playfair text-slate-50 tracking-tight mb-10">Your Companies</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {memberships.map((m) => (
            <div key={m.company.id} className="p-10 sm:p-12 border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md transition-all hover:border-white/20">
              <h3 className="text-3xl font-light text-slate-50 mb-3">{m.company.name}</h3>
              <p className="text-sm font-mono tracking-wider uppercase text-slate-400 mb-10">Role: <span className="font-semibold text-slate-300 capitalize">{m.role}</span></p>
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
