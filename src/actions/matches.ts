"use server";

import { db } from "@/db";
import { match } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createNewMatch = async (
  tournamentId: number,
  team1Id: number,
  team2Id: number
) => {
  await db.insert(match).values({
    tournament_id: tournamentId,
    team1_id: team1Id,
    team2_id: team2Id,
  });
};

export const getMatchesForTournament = async (tournamentId: number) => {
  const matches = await db
    .select()
    .from(match)
    .where(eq(match.tournament_id, tournamentId));
  return matches;
};
