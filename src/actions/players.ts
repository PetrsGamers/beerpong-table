"use server";

import { db } from "@/db";
import { player, team } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getPlayersForTeamId = async (teamId: number) => {
  const first = await db
    .select()
    .from(team)
    .where(eq(team.id, teamId))
    .innerJoin(player, eq(team.player1_id, player.id));
  const second = await db
    .select()
    .from(team)
    .where(eq(team.id, teamId))
    .innerJoin(player, eq(team.player2_id, player.id));
  return { player1: first[0].player, player2: second[0].player };
};
