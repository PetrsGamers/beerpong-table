"use server";

import { db } from "@/db";
import { player, tournament } from "@/db/schema";
import { Player } from "@/db/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPlayersForTournamentId(tournamentId: number) {
  const t = await db
    .select({ seasonId: tournament.seasonId })
    .from(tournament)
    .where(eq(tournament.id, tournamentId))
    .limit(1);

  if (!t[0]) return [];

  return db.select().from(player).where(eq(player.seasonId, t[0].seasonId));
}

export async function getPlayersForTeamId(teamId: number) {
  return [];
}

export async function addPlayerScoreAndBJ(
  playerId: number,
  score: number,
  blowjobs: number
) {
  return null;
}

export async function getPlayersForSeason(seasonId: number) {
  return db.select().from(player).where(eq(player.seasonId, seasonId));
}

export async function getPlayerById(id: number) {
  const result = await db
    .select()
    .from(player)
    .where(eq(player.id, id))
    .limit(1);
  return result[0];
}

export async function createPlayer(data: { name: string; seasonId: number }) {
  const result = await db
    .insert(player)
    .values({
      name: data.name,
      seasonId: data.seasonId,
    })
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function updatePlayer(id: number, data: Partial<Player>) {
  const result = await db
    .update(player)
    .set({
      ...(data.name ? { name: data.name } : {}),
    })
    .where(eq(player.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function deletePlayer(id: number) {
  const result = await db
    .delete(player)
    .where(eq(player.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}
