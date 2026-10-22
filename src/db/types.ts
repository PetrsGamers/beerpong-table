import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  season,
  tournament,
  round,
  team,
  player,
  teamPlayer,
  match,
  playerMatchScore,
} from "./schema";

export type Season = InferSelectModel<typeof season>;
export type NewSeason = InferInsertModel<typeof season>;

export type Tournament = InferSelectModel<typeof tournament>;
export type NewTournament = InferInsertModel<typeof tournament>;

export type Round = InferSelectModel<typeof round>;
export type NewRound = InferInsertModel<typeof round>;

export type Team = InferSelectModel<typeof team>;
export type NewTeam = InferInsertModel<typeof team>;

export type Player = InferSelectModel<typeof player>;
export type NewPlayer = InferInsertModel<typeof player>;

export type TeamPlayer = InferSelectModel<typeof teamPlayer>;
export type NewTeamPlayer = InferInsertModel<typeof teamPlayer>;

export type Match = InferSelectModel<typeof match>;
export type NewMatch = InferInsertModel<typeof match>;

export type PlayerMatchScore = InferSelectModel<typeof playerMatchScore>;
export type NewPlayerMatchScore = InferInsertModel<typeof playerMatchScore>;
