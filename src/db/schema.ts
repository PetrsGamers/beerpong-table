import { integer, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";

export const tournament = pgTable("tournament", {
  id: serial("id").primaryKey(), // Add .primaryKey() here
  name: text("name"),
});

// The rest of your schema remains the same
export const player = pgTable("player", {
  id: serial("id").primaryKey(), // It's good to add this for all tables
  name: text("name"),
  score: numeric("score"),
  blowjobs: numeric("blowjobs"),
});

export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  name: text("name"),
  score: numeric("score"),
  player1_id: integer("player1_id").references(() => player.id),
  player2_id: integer("player2_id").references(() => player.id),
  tournament_id: integer("tournament_id").references(() => tournament.id),
});

export const match = pgTable("match", {
  id: serial("id").primaryKey(),
  tournament_id: integer("tournament_id").references(() => tournament.id),
  team1_id: integer("team1_id").references(() => team.id),
  team2_id: integer("team2_id").references(() => team.id),
  score: text("score"),
});

export const player_match_score = pgTable("player_match_score", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id").references(() => player.id),
  match_id: integer("match_id").references(() => match.id),
  score: numeric("score"),
  blowjobs: numeric("blowjobs"),
});