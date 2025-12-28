CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password_hash" text,
	"api_key" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"github_id" varchar(255),
	CONSTRAINT "companies_email_unique" UNIQUE("email")
);
