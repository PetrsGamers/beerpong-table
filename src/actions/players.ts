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

export const getPlayersForTournamentId = async (tournamentId: number) => {
  const teams = await db
    .select()
    .from(team)
    .where(eq(team.tournament_id, tournamentId));
  const players = [];
  for (const team of teams) {
    const first = team.player1_id ? await db
      .select()
      .from(player)
      .where(eq(player.id, team.player1_id)) : [];
      players.push(first[0]);
    const second = team.player2_id ? await db
      .select()
      .from(player)
      .where(eq(player.id, team.player2_id)) : [];
    players.push(second[0]);}
return players;
}
