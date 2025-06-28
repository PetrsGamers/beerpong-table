CREATE TABLE IF NOT EXISTS "player_tournament" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer,
	"team_tournament_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "score" (
	"id" serial PRIMARY KEY NOT NULL,
	"score" integer,
	"bonus_score" integer,
	"player_id" integer,
	"match_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "season" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"create_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_match_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"score_team1" integer,
	"score_team2" integer,
	"match_id" integer,
	"team1_id" integer,
	"team2_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_tournament" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"tournament_id" integer
);
--> statement-breakpoint
DROP TABLE "player_match_score";--> statement-breakpoint
ALTER TABLE "match" DROP CONSTRAINT "match_team1_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "match" DROP CONSTRAINT "match_team2_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_player1_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_player2_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_tournament_id_tournament_id_fk";
--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "submit_datetime" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "round_number" integer;--> statement-breakpoint
ALTER TABLE "tournament" ADD COLUMN "season_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_tournament" ADD CONSTRAINT "player_tournament_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_tournament" ADD CONSTRAINT "player_tournament_team_tournament_id_team_tournament_id_fk" FOREIGN KEY ("team_tournament_id") REFERENCES "public"."team_tournament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "score" ADD CONSTRAINT "score_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "score" ADD CONSTRAINT "score_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_match_score" ADD CONSTRAINT "team_match_score_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_match_score" ADD CONSTRAINT "team_match_score_team1_id_team_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_match_score" ADD CONSTRAINT "team_match_score_team2_id_team_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_tournament" ADD CONSTRAINT "team_tournament_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_tournament" ADD CONSTRAINT "team_tournament_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament" ADD CONSTRAINT "tournament_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "team1_id";--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "team2_id";--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN IF EXISTS "blowjobs";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "player1_id";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "player2_id";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "tournament_id";