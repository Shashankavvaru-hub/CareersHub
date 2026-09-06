# Visual Theme Rules

## 1. Application Shell Theme (Digital Serenity)
The internal recruiter-facing application (Dashboard, Login, Onboarding, Page Editor) must strictly follow the "Digital Serenity" dark theme.

Core Tokens:
- **Backgrounds**: `bg-slate-900`, `bg-black`, `bg-slate-800` (often composed as `bg-gradient-to-br from-slate-900 via-black to-slate-800`)
- **Text**: Primary `text-slate-50`, Secondary `text-slate-300` or `text-slate-400`
- **Borders/Dividers**: Subtle slate opacity `border-slate-800`, `border-white/10`
- **Typography**: `font-sans` for standard text, `font-mono` for small tracking labels (e.g., `uppercase tracking-widest text-xs`), `font-playfair` for prominent brand headings or major titles.
- **Accents**: Glowing effects using `shadow-[0_0_20px_rgba(...)]`, translucent slate elements `bg-slate-800/50 backdrop-blur-md`.
- **Cards/Containers**: Should use glassmorphism or deep dark backgrounds (`bg-black/40 border border-slate-800`) instead of solid white cards.

## 2. Public Careers Pages Excluded
This dark theme applies **ONLY** to the internal SaaS recruiter application.
The candidate-facing public Careers Pages must **NEVER** inherit this dark theme by default. 
Public pages must remain entirely neutral and driven by the specific Tenant/Company's own configured branding settings (their chosen colors, logos, and fonts).

## 3. UI Components
When integrating generic components into the internal application, always convert their default light-mode classes (e.g. `bg-white`, `text-gray-900`, `border-gray-200`) into the Digital Serenity dark mode palette. Do not rely on automatic `dark:` variants unless configuring the Next.js `next-themes` provider globally. Prefer explicitly setting the dark tokens for the recruiter interface.
