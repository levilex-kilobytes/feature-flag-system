CREATE TABLE "flag_environments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flag_id" uuid NOT NULL,
	"environment" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"rollout_percentage" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "flag_targets" RENAME COLUMN "flag_id" TO "flag_environment_id";--> statement-breakpoint
ALTER TABLE "flag_targets" DROP CONSTRAINT "flag_targets_flag_id_flags_id_fk";
--> statement-breakpoint
ALTER TABLE "flag_environments" ADD CONSTRAINT "flag_environments_flag_id_flags_id_fk" FOREIGN KEY ("flag_id") REFERENCES "public"."flags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flag_targets" ADD CONSTRAINT "flag_targets_flag_environment_id_flag_environments_id_fk" FOREIGN KEY ("flag_environment_id") REFERENCES "public"."flag_environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "enabled";--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "rollout_percentage";