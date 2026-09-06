# Whitecarrot Careers Page Builder

This is a multi-tenant ATS Careers Page Builder prototype.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Testing**: Vitest, React Testing Library, Playwright
- **Planned Backend**: Neon PostgreSQL, Drizzle ORM, Clerk Auth, Cloudinary

## Architecture

This project uses a Modular Monolith architecture. Business domains are separated within the `src/modules` directory to keep concerns decoupled, rather than mixing all domain logic into a single generic components folder.

Expected future domains include:
- `identity`
- `tenant`
- `builder`
- `publishing`
- `media`
- `jobs`
- `public`
- `audit`

## Getting Started

1. Copy `.env.example` to `.env.local`
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Run unit tests:
   ```bash
   pnpm test
   ```
5. Run end-to-end tests:
   ```bash
   npx playwright test
   ```
