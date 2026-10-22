"use server";

import { db } from "@/db";
import { team, tournament } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTeamsForTournament = async (tournamentId: number) => {
  const t = await db
    .select({ seasonId: tournament.seasonId })
    .from(tournament)
    .where(eq(tournament.id, tournamentId))
    .limit(1);

  if (!t[0]) return [];

  return db.select().from(team).where(eq(team.seasonId, t[0].seasonId));
};
