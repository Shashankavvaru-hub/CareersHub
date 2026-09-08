import React from 'react';
import type { Job, PageSection } from '../../db/schema';
import JobBoard from './JobBoard';
import { PublicHeader } from './PublicHeader';

type ThemeConfig = {
  presetTheme?: string;
  logoUrl?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  heroImageUrl?: string;
  cultureVideoUrl?: string;
};

export const THEMES: Record<string, {
  bgOuter: string;
  navBg: string;
  textColor: string;
  textMuted: string;
  accentBg: string;
  accentText: string;
  sectionEven: string;
  sectionOdd: string;
  cardBg: string;
  cardBorder: string;
}> = {
  minimal_light: {
    bgOuter: 'bg-slate-50', navBg: 'bg-white/80', textColor: 'text-slate-900', textMuted: 'text-slate-600',
    accentBg: 'bg-indigo-600 hover:bg-indigo-700', accentText: 'text-indigo-600',
    sectionEven: 'bg-white', sectionOdd: 'bg-slate-50', cardBg: 'bg-white', cardBorder: 'border-slate-200 hover:border-slate-300'
  },
  modern_dark: {
    bgOuter: 'bg-slate-950', navBg: 'bg-slate-950/80', textColor: 'text-slate-50', textMuted: 'text-slate-400',
    accentBg: 'bg-emerald-600 hover:bg-emerald-500', accentText: 'text-emerald-500',
    sectionEven: 'bg-slate-900', sectionOdd: 'bg-slate-950', cardBg: 'bg-slate-900', cardBorder: 'border-slate-800 hover:border-slate-600'
  },
  ocean: {
    bgOuter: 'bg-sky-950', navBg: 'bg-sky-950/80', textColor: 'text-sky-50', textMuted: 'text-sky-300',
    accentBg: 'bg-sky-600 hover:bg-sky-500', accentText: 'text-sky-400',
    sectionEven: 'bg-sky-900', sectionOdd: 'bg-sky-950', cardBg: 'bg-sky-900', cardBorder: 'border-sky-800 hover:border-sky-600'
  },
  sunset: {
    bgOuter: 'bg-orange-50', navBg: 'bg-orange-50/80', textColor: 'text-stone-900', textMuted: 'text-stone-600',
    accentBg: 'bg-orange-600 hover:bg-orange-700', accentText: 'text-orange-600',
    sectionEven: 'bg-white', sectionOdd: 'bg-orange-50', cardBg: 'bg-white', cardBorder: 'border-orange-200 hover:border-orange-300'
  }
};

function getEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export default function PublicPageRenderer({
  companyName,
  themeConfig,
  sections,
  jobs,
  previewMode = false,
}: {
  companyName: string;
  themeConfig: ThemeConfig;
  sections: PageSection[];
  jobs: Job[];
  previewMode?: boolean;
}) {
  const activeTheme = THEMES[themeConfig.presetTheme || 'minimal_light'] || THEMES['minimal_light'];
  const heroImage = themeConfig.heroImageUrl || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=3000&auto=format&fit=crop';
  const embedUrl = getEmbedUrl(themeConfig.cultureVideoUrl);

  // In preview mode the amber banner (≈36px) sits at top-0, so the nav
  // must start below it. On the real public page the nav starts at top-0.
  const navTopClass = previewMode ? 'top-[36px]' : 'top-0';
  // Content needs padding-top = nav height (96px) + banner height when in preview
  const contentPadding = previewMode ? 'pt-[132px]' : 'pt-24';

  return (
    <div className={`min-h-screen ${activeTheme.bgOuter} font-sans selection:bg-black selection:text-white transition-colors duration-300`}>
      
      <PublicHeader 
        companyName={companyName}
        logoUrl={themeConfig.logoUrl}
        sections={sections}
        previewMode={previewMode}
        activeTheme={activeTheme}
      />
      
      <div>

      {/* Hero Section */}
      <header className="relative min-h-[80vh] flex flex-col justify-end px-6 pb-24 bg-black">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Hero background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold text-white tracking-tighter leading-[0.9] mb-6">
            {themeConfig.heroHeadline || `Join ${companyName}`}
          </h1>
          <p className="text-[clamp(1.125rem,2vw,1.5rem)] text-white/80 font-medium max-w-2xl mx-auto">
            {themeConfig.heroSubtext || "We're always looking for talented people to join our team."}
          </p>
          <div className="mt-12 flex justify-center">
            <a 
              href="#jobs" 
              className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold transition-transform hover:scale-105 ${activeTheme.accentBg}`}
            >
              View Open Roles
            </a>
          </div>
        </div>
      </header>

      {/* Culture Video Section */}
      {embedUrl && (
        <section className={`relative z-30 -mt-16 max-w-5xl mx-auto px-6 mb-16`}>
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black">
            <iframe 
              src={embedUrl} 
              className="w-full h-full" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              loading="lazy"
              title="Company Culture Video"
            ></iframe>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <main className={`relative z-20 ${embedUrl ? '' : '-mt-8'}`}>
        {sections.map((section, index) => {
          
          // Alternating background colors for sections
          const isEven = index % 2 === 0;
          const bgClass = isEven ? activeTheme.sectionEven : activeTheme.sectionOdd;
          
          return (
            <section 
              key={section.id} 
              id={section.type}
              className={`w-full relative overflow-hidden ${bgClass} scroll-mt-24`}
            >
              {/* Top border line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-black/5"></div>

              <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-24">
                  
                  {/* Section Title (Left Side on Desktop) */}
                  <div className="md:w-1/3 shrink-0">
                    <p className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${activeTheme.accentText}`}>
                      {String(index + 1).padStart(2, '0')} — {section.type.replace(/_/g, ' ')}
                    </p>
                    <h2 className={`text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.9] tracking-tighter ${activeTheme.textColor}`}>
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Content (Right Side on Desktop) */}
                  <div className="md:w-2/3">
                    {section.type === 'jobs' ? (
                      <JobBoard jobs={jobs} activeTheme={activeTheme} />
                    ) : (
                      <div className={`prose prose-lg max-w-none font-medium leading-relaxed ${activeTheme.textMuted}`}>
                        {/* Safe rendering of body content. In a real app we'd use a markdown parser. MVP uses whitespace pre-wrap */}
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                          {(section.content as any)?.body || 'No content provided.'}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {themeConfig.logoUrl && (
              <img src={themeConfig.logoUrl} alt="Logo" className="h-6 object-contain opacity-50 grayscale" />
            )}
            <span className="text-slate-400 font-semibold">&copy; {new Date().getFullYear()} {companyName}</span>
          </div>
          <p className="text-slate-500 text-sm">Powered by Whitecarrot Careers</p>
        </div>
      </footer>

      </div>{/* end contentPadding wrapper */}
    </div>
  );
}
