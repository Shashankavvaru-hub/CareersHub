import { ApplicationShell } from '../../components/ApplicationShell';
import { createCompanyAction } from './actions';
import { redirect } from 'next/navigation';
import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '../../lib/auth/current-user';

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  const memberships = await db.select().from(schema.companyMemberships).where(eq(schema.companyMemberships.userId, user.id));
  
  if (memberships.length > 0) {
    redirect('/dashboard');
  }

  return (
    <ApplicationShell>
      <div className="p-8 max-w-md mx-auto mt-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <h1 className="text-3xl font-extralight text-slate-50 font-playfair mb-2 tracking-tight">Welcome to Whitecarrot</h1>
        <p className="text-slate-400 mb-8 text-xs font-mono tracking-wider uppercase">Let&apos;s get your account ready by creating a company.</p>
        
        <form action={createCompanyAction} className="flex flex-col gap-5">
          <div>
            <label htmlFor="name" className="block text-xs font-mono tracking-wider uppercase text-slate-300 mb-2">Company Name</label>
            <input type="text" id="name" name="name" required className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" placeholder="e.g. Acme Technologies" />
          </div>
          <div>
            <label htmlFor="slug" className="block text-xs font-mono tracking-wider uppercase text-slate-300 mb-2">Company Slug</label>
            <input type="text" id="slug" name="slug" required pattern="^[a-z0-9-]+$" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" placeholder="e.g. acme-technologies" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono tracking-wider uppercase leading-relaxed">This will be used for your public careers URL (lowercase letters, numbers, and hyphens only).</p>
          </div>
          <button type="submit" className="mt-6 w-full rounded-full bg-slate-100 text-slate-900 font-medium tracking-wide py-3 hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            Create Company
          </button>
        </form>
      </div>
    </ApplicationShell>
  );
}
