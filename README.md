# Whitecarrot Careers Page Builder

Whitecarrot is a Careers Page Builder for recruiters.

Recruiters can create a branded Careers Page, edit the content, arrange sections, preview changes, and publish the page.

Candidates can open the public Careers Page, search and filter jobs, view job details, and apply through the external application link.

---

## What I Built

### Recruiter

- Recruiter login using Clerk
- Recruiter dashboard
- Company-specific Careers Page
- Careers Page editor
- Add, remove and reorder sections
- Predefined Careers Page themes
- Logo, colors and banner customization
- Draft and published versions
- Preview before publishing

### Candidate

- Public Careers Page
- Company information
- Open jobs
- Job title search
- Location filter
- Job type filter
- Job detail page
- External Apply link
- Mobile-friendly and accessible UI
- SEO-friendly public pages

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL (Neon)
- Drizzle ORM
- Clerk
- Cloudinary
- Zod
- dnd-kit
- Vercel

---

## How to Run

### 1. Install dependencies

```bash
pnpm install
```

### 2. Add environment variables

Create a `.env.local` file and add the required values for:

- Clerk
- Neon PostgreSQL
- Cloudinary

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Seed sample data

```bash
pnpm db:seed
```

### 5. Start the development server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

## Step-by-Step User Guide

### Recruiter

**Step 1: Login**

Open `/login` and sign in using a recruiter account.

**Step 2: Open the Dashboard**

After login, the recruiter is taken to the dashboard.

From here, the recruiter can open their company's Careers Page.

**Step 3: Edit the Careers Page**

Open the page editor.

The recruiter can:

- Change page content
- Add sections
- Remove sections
- Reorder sections
- Select a theme
- Change the logo
- Change brand colors
- Change the banner

**Step 4: Save**

Save the changes as a draft.

The draft is not shown to candidates.

**Step 5: Preview**

Open the preview to check how the Careers Page looks before publishing.

**Step 6: Publish**

Publish the page when the recruiter is happy with the changes.

Only the published version is shown publicly.

**Step 7: Share**

Share the company's Careers Page URL with candidates.

Example:

```text
/acme-technologies/careers
```

### Candidate

**Step 1: Open the Careers Page**

The candidate opens the URL shared by the company.

**Step 2: Explore the Company**

The candidate can read about the company, its values, culture and work environment.

**Step 3: Find a Job**

The candidate can:

- Search by job title
- Filter by location
- Filter by job type

**Step 4: Open a Job**

The candidate opens a job to see the full job description and details.

**Step 5: Apply**

The candidate clicks Apply.

They are taken to the external application URL.

No candidate account is required.

---

## Main Flow

```text
Recruiter

Login
  ↓
Dashboard
  ↓
Edit Careers Page
  ↓
Save Draft
  ↓
Preview
  ↓
Publish
  ↓
Share Careers URL
```

```text
Candidate

Careers URL
  ↓
Company Page
  ↓
Search / Filter Jobs
  ↓
Job Details
  ↓
External Apply
```
