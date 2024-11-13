"use server";

import { db } from "@/db";
import { team } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTeamsForTournament = async (tournamentId: number) => {
  const teams = await db
    .select()
    .from(team)
    .where(eq(team.tournament_id, tournamentId));
  return teams;
};
