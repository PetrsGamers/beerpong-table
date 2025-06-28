import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Player
export const player = pgTable("player", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

// Team
export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

// Season
export const season = pgTable("season", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createTime: timestamp("create_time").notNull().defaultNow(),
});

// Tournament
export const tournament = pgTable("tournament", {
  id: serial("id").primaryKey(),
  name: text("name"),
  seasonId: integer("season_id").references(() => season.id),
});

// TeamTournament (many-to-many Team <-> Tournament)
export const teamTournament = pgTable("team_tournament", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => team.id),
  tournamentId: integer("tournament_id").references(() => tournament.id),
});

// PlayerTournament (many-to-many Player <-> TeamTournament)
export const playerTournament = pgTable("player_tournament", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => player.id),
  teamTournamentId: integer("team_tournament_id").references(
    () => teamTournament.id
  ),
});

// Match
export const match = pgTable("match", {
  id: serial("id").primaryKey(),
  submitDatetime: timestamp("submit_datetime").notNull().defaultNow(),
  roundNumber: integer("round_number"),
  tournamentId: integer("tournament_id").references(() => tournament.id),
});

// TeamMatchScore (Team vs Team results in a Match)
export const teamMatchScore = pgTable("team_match_score", {
  id: serial("id").primaryKey(),
  scoreTeam1: integer("score_team1"),
  scoreTeam2: integer("score_team2"),
  matchId: integer("match_id").references(() => match.id),
  team1Id: integer("team1_id").references(() => team.id),
  team2Id: integer("team2_id").references(() => team.id),
});

// Player Score in Match
export const score = pgTable("score", {
  id: serial("id").primaryKey(),
  score: integer("score"),
  bonusScore: integer("bonus_score"),
  playerId: integer("player_id").references(() => player.id),
  matchId: integer("match_id").references(() => match.id),
});
