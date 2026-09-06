# Phase 3 — Clerk Authentication & Tenant Authorization

## Overview
This document outlines the authentication and authorization strategy for the Whitecarrot ATS Careers Page Builder. Identity management is offloaded to Clerk, while tenant-level authorization and role management are securely enforced server-side via PostgreSQL.

## Architecture

### 1. Clerk Authentication
Clerk acts as the source of truth for identity and session management.
- **Middleware (`src/proxy.ts`)**: Protects application routes from unauthenticated access. It enforces `auth.protect()` on all routes EXCEPT public routes (`/`, `/sign-in`, `/sign-up`, and `/[company-slug]/careers`).
- **Identity Sync (`src/lib/auth/current-user.ts`)**: When an authenticated user hits a protected server action or data boundary, `getCurrentUser()` resolves their `users` record. If it doesn't exist, it idempotently creates one using `clerk_user_id` as the stable external identity.

### 2. Tenant Authorization
Authorization logic ensures that a user can only interact with tenant data they are explicitly granted access to.
- **`company_memberships`**: Acts as the junction linking `users` to `companies` with specific roles (`owner`, `admin`, `editor`).
- **Authorization Helpers (`src/lib/auth/authorization.ts`)**:
  - `requireCompanyRole(companyId, allowedRoles)` checks if the current user has a valid membership and sufficient role permissions for the target company. Throws an error otherwise.

### 3. Route Protection Strategy
- **Public Routes** (`/[company-slug]/careers`): Accessible anonymously. Resolves the active company by slug; returns a 404 if the company is inactive or deleted.
- **Protected Recruiter Routes** (`/[company-slug]/edit`, `/[company-slug]/preview`):
  1. Authenticates session (via Clerk Middleware).
  2. Resolves company by slug (via Database).
  3. Authorizes user (via `requireCompanyRole`).
  4. Accesses tenant-scoped data.

## Security Guarantees
- Client-provided identifiers are NEVER trusted for authorization.
- Knowing a company's slug is insufficient for editing; membership is strictly verified.
- Cross-tenant data leaks are prevented by always scoping database queries with the authorized `company_id`.

## Development Workflows
For local development, you must create a real Clerk account. This development account must then be manually mapped to a seeded demo company via a direct SQL insert into the `company_memberships` table using your development Clerk User ID, as deterministic seed users do not possess actual Clerk sessions.
