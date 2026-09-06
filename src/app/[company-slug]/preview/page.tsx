import { db } from '../../../db';
import * as schema from '../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { requireCompanyRole } from '../../../lib/auth/authorization';
import { notFound } from 'next/navigation';
import PublicPageRenderer from '../../../components/careers-page/PublicPageRenderer';

export default async function PreviewPage({ params }: { params: Promise<{ "company-slug": string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams["company-slug"];

  const [company] = await db.select().from(schema.companies)
    .where(and(eq(schema.companies.slug, slug), eq(schema.companies.status, 'active'), isNull(schema.companies.deletedAt)));
  
  if (!company) {
    notFound();
  }

  await requireCompanyRole(company.id, ['owner', 'admin', 'editor']);

  // Get Careers Page
  const [careersPage] = await db.select().from(schema.careersPages)
    .where(eq(schema.careersPages.companyId, company.id));

  if (!careersPage || !careersPage.currentDraftRevisionId) {
    return <div className="p-12 text-center text-xl font-mono bg-black text-white min-h-screen">No draft revision found. Go back and save a draft first.</div>;
  }

  // Get Draft Revision
  const [draftRevision] = await db.select().from(schema.pageRevisions)
    .where(eq(schema.pageRevisions.id, careersPage.currentDraftRevisionId));

  if (!draftRevision) {
    return <div className="p-12 text-center text-xl font-mono bg-black text-white min-h-screen">Draft revision not found.</div>;
  }

  // Fetch sections
  const sections = await db.select().from(schema.pageSections)
    .where(eq(schema.pageSections.revisionId, draftRevision.id))
    .orderBy(schema.pageSections.displayOrder);

  // Fetch active jobs
  const openJobs = await db.select().from(schema.jobs)
    .where(and(eq(schema.jobs.companyId, company.id), eq(schema.jobs.status, 'open')));

  return (
    <>
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 bg-amber-500 text-amber-950 text-xs font-bold uppercase tracking-widest text-center py-1.5 z-[100] shadow-md flex justify-center items-center gap-4">
        <span>Draft Preview Mode</span>
        <span className="w-1 h-1 rounded-full bg-amber-950"></span>
        <span>Not visible to public</span>
      </div>
      
      {/* Push content down so the fixed preview banner doesn't cover the nav */}
      <div className="pt-[28px]">
        <PublicPageRenderer 
          companyName={company.name} 
          themeConfig={draftRevision.themeConfig as any} 
          sections={sections} 
          jobs={openJobs} 
        />
      </div>
    </>
  );
}
