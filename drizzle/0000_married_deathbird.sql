CREATE TYPE "public"."company_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('owner', 'admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."revision_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."section_type" AS ENUM('about', 'life_at_company', 'jobs', 'our_values', 'where_we_work', 'perks', 'custom_text');--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"user_id" uuid,
	"action" varchar(255) NOT NULL,
	"entity_type" varchar(255) NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "careers_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"current_draft_revision_id" uuid,
	"published_revision_id" uuid,
	CONSTRAINT "careers_pages_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"status" "company_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "company_memberships" (
	"company_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "membership_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_memberships_company_id_user_id_pk" PRIMARY KEY("company_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"work_policy" varchar(100),
	"locations" text[] DEFAULT '{}' NOT NULL,
	"department" varchar(100),
	"employment_type" varchar(100),
	"experience_level" varchar(100),
	"job_type" varchar(100),
	"salary_range" varchar(255),
	"status" "job_status" DEFAULT 'open' NOT NULL,
	"application_url" varchar(2048) NOT NULL,
	"date_posted" timestamp with time zone NOT NULL,
	"valid_through" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_company_id_slug_unique" UNIQUE("company_id","slug")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"provider" varchar(50) DEFAULT 'cloudinary' NOT NULL,
	"provider_asset_id" varchar(255) NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"resource_type" varchar(50),
	"mime_type" varchar(100),
	"secure_url" varchar(2048) NOT NULL,
	"width" integer,
	"height" integer,
	"bytes" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_provider_provider_asset_id_unique" UNIQUE("provider","provider_asset_id"),
	CONSTRAINT "media_assets_width_check" CHECK ("media_assets"."width" >= 0),
	CONSTRAINT "media_assets_height_check" CHECK ("media_assets"."height" >= 0),
	CONSTRAINT "media_assets_bytes_check" CHECK ("media_assets"."bytes" >= 0)
);
--> statement-breakpoint
CREATE TABLE "page_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"careers_page_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"lock_version" integer DEFAULT 1 NOT NULL,
	"status" "revision_status" DEFAULT 'draft' NOT NULL,
	"theme_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "page_revisions_careers_page_id_version_unique" UNIQUE("careers_page_id","version"),
	CONSTRAINT "page_revisions_careers_page_id_id_key" UNIQUE("careers_page_id","id")
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"revision_id" uuid NOT NULL,
	"type" "section_type" NOT NULL,
	"title" varchar(120) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_sections_revision_id_display_order_unique" UNIQUE("revision_id","display_order"),
	CONSTRAINT "display_order_check" CHECK ("page_sections"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careers_pages" ADD CONSTRAINT "careers_pages_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_memberships" ADD CONSTRAINT "company_memberships_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_memberships" ADD CONSTRAINT "company_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_revisions" ADD CONSTRAINT "page_revisions_careers_page_id_careers_pages_id_fk" FOREIGN KEY ("careers_page_id") REFERENCES "public"."careers_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_revisions" ADD CONSTRAINT "page_revisions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_revision_id_page_revisions_id_fk" FOREIGN KEY ("revision_id") REFERENCES "public"."page_revisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_slug_idx" ON "companies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "company_memberships_user_company_idx" ON "company_memberships" USING btree ("user_id","company_id");--> statement-breakpoint
CREATE INDEX "jobs_company_status_idx" ON "jobs" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "page_revisions_page_status_idx" ON "page_revisions" USING btree ("careers_page_id","status");--> statement-breakpoint
CREATE INDEX "page_sections_revision_order_idx" ON "page_sections" USING btree ("revision_id","display_order");--> statement-breakpoint
ALTER TABLE "careers_pages" ADD CONSTRAINT "careers_pages_draft_fk" FOREIGN KEY ("id", "current_draft_revision_id") REFERENCES "public"."page_revisions"("careers_page_id", "id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careers_pages" ADD CONSTRAINT "careers_pages_published_fk" FOREIGN KEY ("id", "published_revision_id") REFERENCES "public"."page_revisions"("careers_page_id", "id") ON DELETE set null ON UPDATE no action;