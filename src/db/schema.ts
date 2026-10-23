import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Season (Sezóna – odpovídá jednomu semestru, např. "Jarní semestr 2025")
// Vždy běží právě jedna aktivní sezóna (isActive: true). Minulé sezóny slouží jako archiv.
export const season = pgTable("season", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // např. "Jarní semestr 2025"
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 2. Round (Kolo – jeden turnajový večer v rámci semestru, typicky 1 až 5 kol)
// 5. kolo bývá typicky Velké Finále.
export const round = pgTable("round", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // např. "1. Kolo", "2. Kolo", ..., "5. Kolo - Velké Finále"
  roundNumber: integer("round_number").notNull().default(1),
  seasonId: integer("season_id")
    .notNull()
    .references(() => season.id, { onDelete: "cascade" }),
  date: timestamp("date"), // Datum a čas konání turnajového večera
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 3. Team (Tým – vázaný na sezónu/semestr, jméno je v rámci sezóny unikátní)
// Tým je perzistentní po celý semestr a nemá na sobě natvrdo zadrátované hráče.
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

// 4. Player (Hráč – vázaný na sezónu/semestr, jméno je v rámci sezóny unikátní)
// Hráč je nezávislý na týmech a může v různých kolech nastoupit za různé týmy.
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

// 5. TeamPlayer (Soupiska kola – určení, za jaký tým v daném večeru hráč nastupuje)
// V jednom kole (večeru) může hráč hrát pouze za 1 tým, ale v dalším kole může nastoupit za jiný.
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

// 6. Match (Zápas mezi dvěma týmy v rámci turnajového večera / kola)
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

// 7. PlayerMatchScore (Individuální výkon hráče v konkrétním zápase – kelímky a blowjobs)
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
    score: integer("score").notNull().default(0), // trefené kelímky
    blowjobs: integer("blowjobs").notNull().default(0), // úspěšně vyfouknuté kelímky
  },
  (t) => ({
    matchPlayerUnq: unique("match_player_unq").on(t.matchId, t.playerId),
  })
);

// Relace (Drizzle ORM Relations)
export const seasonRelations = relations(season, ({ many }) => ({
  rounds: many(round),
  teams: many(team),
  players: many(player),
}));

export const roundRelations = relations(round, ({ one, many }) => ({
  season: one(season, {
    fields: [round.seasonId],
    references: [season.id],
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
}));

export const playerRelations = relations(player, ({ one, many }) => ({
  season: one(season, {
    fields: [player.seasonId],
    references: [season.id],
  }),
  teamPlayers: many(teamPlayer),
  scores: many(playerMatchScore),
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
