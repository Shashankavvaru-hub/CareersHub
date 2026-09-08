'use client';
import React from 'react';

import { cn } from '../../lib/utils';
import { MenuToggleIcon } from '../ui/menu-toggle-icon';
import { useScroll } from '../ui/use-scroll';
import type { PageSection } from '../../db/schema';

export function PublicHeader({
  companyName,
  logoUrl,
  sections,
  previewMode = false,
  activeTheme,
}: {
  companyName: string;
  logoUrl?: string;
  sections: PageSection[];
  previewMode?: boolean;
  activeTheme: any;
}) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  // Dynamically generate links based on the sections the recruiter added
  const links = sections.map((section) => ({
    label: section.type === 'jobs' ? 'Open Positions' : section.type.replace(/_/g, ' '),
    // We use the section type as the HTML ID so anchor links work
    href: `#${section.type}`,
  }));

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle the top offset if we are rendering inside the recruiter Preview iframe
  const topOffset = previewMode ? 'md:top-[52px]' : 'md:top-4';
  const mobileTopOffset = previewMode ? 'top-[36px]' : 'top-0';

  return (
    <header
      className={cn(
        `fixed left-0 right-0 ${mobileTopOffset} z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-full md:border md:transition-all md:ease-out`,
        {
          [`bg-black/90 supports-[backdrop-filter]:bg-black/50 border-white/10 backdrop-blur-lg ${topOffset} md:shadow-2xl`]:
            scrolled && !open,
          'bg-black/95': open,
          'bg-transparent': !scrolled && !open, // completely transparent at the very top
        }
      )}
    >
      <nav
        className={cn(
          'flex h-20 w-full items-center justify-between px-6 md:h-16 md:transition-all md:ease-out',
          {
            'md:px-4': scrolled,
          }
        )}
      >
        {/* Logo / Company Name */}
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={`${companyName} logo`} className="h-8 w-auto object-contain" />
          ) : (
            <div className={`h-8 w-8 rounded-lg ${activeTheme.accentBg} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{companyName.charAt(0)}</span>
            </div>
          )}
          <span className="font-bold text-lg text-white tracking-tight">{companyName}</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link, i) => (
            <a 
              key={i} 
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors capitalize" 
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          {links.some(l => l.href === '#jobs') && (
            <a href="#jobs" className={`ml-4 px-5 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 ${activeTheme.accentBg}`}>
              Apply Now
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-white p-2"
        >
          <MenuToggleIcon open={open} className="size-6" duration={300} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'bg-black/95 fixed top-20 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-white/10 md:hidden backdrop-blur-xl',
          open ? 'block' : 'hidden'
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col p-6 pt-12 gap-y-6'
          )}
        >
          <div className="flex flex-col gap-y-6">
            {links.map((link) => (
              <a
                key={link.label}
                className="text-2xl font-light text-white hover:text-white/80 transition-colors capitalize border-b border-white/10 pb-4"
                href={link.href}
                onClick={() => setOpen(false)} // CLOSE MENU ON CLICK
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="mt-auto pb-12">
            {links.some(l => l.href === '#jobs') && (
              <a 
                href="#jobs" 
                onClick={() => setOpen(false)}
                className={`w-full flex justify-center py-4 rounded-xl text-lg font-semibold text-white ${activeTheme.accentBg}`}
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
