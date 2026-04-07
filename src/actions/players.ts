"use server";

import { db } from "@/db";
import { player, team } from "@/db/schema";
import { Player } from "@/types/player";
import { eq } from "drizzle-orm";

const toNumber = (value: string | null) => (value ? Number(value) : 0);

const toPlayer = (row: typeof player.$inferSelect): Player => ({
  id: row.id,
  name: row.name ?? "",
  score: toNumber(row.score),
  blowjobs: toNumber(row.blowjobs),
});

export const getPlayerById = async (playerId: number) => {
  const pl = await db.select().from(player).where(eq(player.id, playerId));
  return pl.length > 0 ? toPlayer(pl[0]) : null;
};

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
  return {
    player1: first[0]?.player ? toPlayer(first[0].player) : null,
    player2: second[0]?.player ? toPlayer(second[0].player) : null,
  };
};

export const addPlayerScoreAndBJ = async (
  playerId: number,
  score: number,
  BJ: number
) => {
  console.log("addPlayerScoreAndBJ", playerId, score, BJ);
  const pl = await getPlayerById(playerId);
  if (!pl) {
    throw new Error("Player not found");
  }

  const newScore = pl.score + score;
  const newBJ = pl.blowjobs + BJ;

  await db
    .update(player)
    .set({ score: newScore.toString(), blowjobs: newBJ.toString() })
    .where(eq(player.id, playerId));

  return;
};
export const getPlayersForTournamentId = async (tournamentId: number) => {
  const teams = await db
    .select()
    .from(team)
    .where(eq(team.tournament_id, tournamentId));
  const players: Player[] = [];
  for (const team of teams) {
    const first = team.player1_id
      ? await db.select().from(player).where(eq(player.id, team.player1_id))
      : [];
    if (first[0]) {
      players.push(toPlayer(first[0]));
    }
    const second = team.player2_id
      ? await db.select().from(player).where(eq(player.id, team.player2_id))
      : [];
    if (second[0]) {
      players.push(toPlayer(second[0]));
    }
  }
  return players;
};
