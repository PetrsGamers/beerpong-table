CREATE TABLE IF NOT EXISTS "scheduled_match" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer,
	"round" integer,
	"table_number" integer,
	"team1_id" integer,
	"team2_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scheduled_match" ADD CONSTRAINT "scheduled_match_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scheduled_match" ADD CONSTRAINT "scheduled_match_team1_id_team_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scheduled_match" ADD CONSTRAINT "scheduled_match_team2_id_team_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
