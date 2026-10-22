CREATE TABLE IF NOT EXISTS "round" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"round_number" integer DEFAULT 1 NOT NULL,
	"tournament_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "season" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"round_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	CONSTRAINT "round_player_unq" UNIQUE("round_id","player_id")
);
--> statement-breakpoint
ALTER TABLE "match" DROP CONSTRAINT "match_tournament_id_tournament_id_fk";
--> statement-breakpoint
ALTER TABLE "match" DROP CONSTRAINT "match_team1_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "match" DROP CONSTRAINT "match_team2_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "player_match_score" DROP CONSTRAINT "player_match_score_player_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "player_match_score" DROP CONSTRAINT "player_match_score_match_id_match_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_player1_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_player2_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_tournament_id_tournament_id_fk";
--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "team1_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "team2_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "player_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "match_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "score" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "score" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "blowjobs" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "blowjobs" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "player_match_score" ALTER COLUMN "blowjobs" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "round_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "team1_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "team2_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "status" text DEFAULT 'completed' NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "player" ADD COLUMN "season_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "player" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "player_match_score" ADD COLUMN "team_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "season_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament" ADD COLUMN "season_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round" ADD CONSTRAINT "round_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_player" ADD CONSTRAINT "team_player_round_id_round_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."round"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_player" ADD CONSTRAINT "team_player_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_player" ADD CONSTRAINT "team_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_round_id_round_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."round"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_team1_id_team_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_team2_id_team_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player" ADD CONSTRAINT "player_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_match_score" ADD CONSTRAINT "player_match_score_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_match_score" ADD CONSTRAINT "player_match_score_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_match_score" ADD CONSTRAINT "player_match_score_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team" ADD CONSTRAINT "team_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament" ADD CONSTRAINT "tournament_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "tournament_id";--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN IF EXISTS "blowjobs";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "score";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "player1_id";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "player2_id";--> statement-breakpoint
ALTER TABLE "team" DROP COLUMN IF EXISTS "tournament_id";--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_season_name_unq" UNIQUE("season_id","name");--> statement-breakpoint
ALTER TABLE "player_match_score" ADD CONSTRAINT "match_player_unq" UNIQUE("match_id","player_id");--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_season_name_unq" UNIQUE("season_id","name");