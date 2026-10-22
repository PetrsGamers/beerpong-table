import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Season (Sezóna – např. "Jarní semestr 2025")
export const season = pgTable("season", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 2. Tournament (Turnaj – samostatná událost v rámci sezóny, např. "Brno Cup", "1. Kolo")
export const tournament = pgTable("tournament", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  seasonId: integer("season_id")
    .notNull()
    .references(() => season.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 3. Round (Kolo – jednotlivá fáze turnaje: 1. kolo, 2. kolo, play-off, ...)
export const round = pgTable("round", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roundNumber: integer("round_number").notNull().default(1),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 4. Team (Tým – vázaný na sezónu, jméno je v rámci sezóny unikátní)
export const team = pgTable(
  "team",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    seasonId: integer("season_id")
      .notNull()
      .references(() => season.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    teamSeasonNameUnq: unique("team_season_name_unq").on(t.seasonId, t.name),
  })
);

// 5. Player (Hráč – vázaný na sezónu, jméno je v rámci sezóny unikátní, může měnit týmy)
export const player = pgTable(
  "player",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    seasonId: integer("season_id")
      .notNull()
      .references(() => season.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    playerSeasonNameUnq: unique("player_season_name_unq").on(
      t.seasonId,
      t.name
    ),
  })
);

// 6. TeamPlayer (Složení týmu pro konkrétní kolo – dynamický počet hráčů, flexibilní soupiska)
export const teamPlayer = pgTable(
  "team_player",
  {
    id: serial("id").primaryKey(),
    roundId: integer("round_id")
      .notNull()
      .references(() => round.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    playerId: integer("player_id")
      .notNull()
      .references(() => player.id, { onDelete: "cascade" }),
  },
  (t) => ({
    roundPlayerUnq: unique("round_player_unq").on(t.roundId, t.playerId),
  })
);

// 7. Match (Konkrétní utkání mezi dvěma týmy v rámci kola)
export const match = pgTable("match", {
  id: serial("id").primaryKey(),
  roundId: integer("round_id")
    .notNull()
    .references(() => round.id, { onDelete: "cascade" }),
  team1Id: integer("team1_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  team2Id: integer("team2_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  team1Score: integer("team1_score").notNull().default(0),
  team2Score: integer("team2_score").notNull().default(0),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 8. PlayerMatchScore (Individuální skóre a blowjobs hráčů v konkrétním zápase)
export const playerMatchScore = pgTable(
  "player_match_score",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    playerId: integer("player_id")
      .notNull()
      .references(() => player.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    score: integer("score").notNull().default(0),
    blowjobs: integer("blowjobs").notNull().default(0),
  },
  (t) => ({
    matchPlayerUnq: unique("match_player_unq").on(t.matchId, t.playerId),
  })
);

// Drizzle Relations
export const seasonRelations = relations(season, ({ many }) => ({
  tournaments: many(tournament),
  teams: many(team),
  players: many(player),
}));

export const tournamentRelations = relations(tournament, ({ one, many }) => ({
  season: one(season, {
    fields: [tournament.seasonId],
    references: [season.id],
  }),
  rounds: many(round),
}));

export const roundRelations = relations(round, ({ one, many }) => ({
  tournament: one(tournament, {
    fields: [round.tournamentId],
    references: [tournament.id],
  }),
  matches: many(match),
  teamPlayers: many(teamPlayer),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
  season: one(season, {
    fields: [team.seasonId],
    references: [season.id],
  }),
  teamPlayers: many(teamPlayer),
  matchesAsTeam1: many(match, { relationName: "team1Matches" }),
  matchesAsTeam2: many(match, { relationName: "team2Matches" }),
  playerScores: many(playerMatchScore),
}));

export const playerRelations = relations(player, ({ one, many }) => ({
  season: one(season, {
    fields: [player.seasonId],
    references: [season.id],
  }),
  teamPlayers: many(teamPlayer),
  matchScores: many(playerMatchScore),
}));

export const teamPlayerRelations = relations(teamPlayer, ({ one }) => ({
  round: one(round, {
    fields: [teamPlayer.roundId],
    references: [round.id],
  }),
  team: one(team, {
    fields: [teamPlayer.teamId],
    references: [team.id],
  }),
  player: one(player, {
    fields: [teamPlayer.playerId],
    references: [player.id],
  }),
}));

export const matchRelations = relations(match, ({ one, many }) => ({
  round: one(round, {
    fields: [match.roundId],
    references: [round.id],
  }),
  team1: one(team, {
    fields: [match.team1Id],
    references: [team.id],
    relationName: "team1Matches",
  }),
  team2: one(team, {
    fields: [match.team2Id],
    references: [team.id],
    relationName: "team2Matches",
  }),
  playerScores: many(playerMatchScore),
}));

export const playerMatchScoreRelations = relations(
  playerMatchScore,
  ({ one }) => ({
    match: one(match, {
      fields: [playerMatchScore.matchId],
      references: [match.id],
    }),
    player: one(player, {
      fields: [playerMatchScore.playerId],
      references: [player.id],
    }),
    team: one(team, {
      fields: [playerMatchScore.teamId],
      references: [team.id],
    }),
  })
);
