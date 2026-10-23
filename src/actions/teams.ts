"use server";

import { db } from "@/db";
import { player, team, teamPlayer } from "@/db/schema";
import { Team } from "@/db/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTeamsForSeason(seasonId: number) {
  return db.select().from(team).where(eq(team.seasonId, seasonId));
}

export async function getTeamById(id: number) {
  const result = await db.select().from(team).where(eq(team.id, id)).limit(1);
  return result[0];
}

export async function createTeam(data: { name: string; seasonId: number }) {
  const result = await db
    .insert(team)
    .values({
      name: data.name,
      seasonId: data.seasonId,
    })
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function updateTeam(id: number, data: Partial<Team>) {
  const result = await db
    .update(team)
    .set({
      ...(data.name ? { name: data.name } : {}),
    })
    .where(eq(team.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function deleteTeam(id: number) {
  const result = await db.delete(team).where(eq(team.id, id)).returning();
  revalidatePath("/");
  return result[0];
}

// Přiřazení hráče do týmu v daném kole (večeru)
export async function assignPlayerToTeamInRound(
  roundId: number,
  teamId: number,
  playerId: number
) {
  // Smažeme případné existující přiřazení hráče v daném kole (hráč může být v kole jen v jednom týmu)
  await db
    .delete(teamPlayer)
    .where(
      and(eq(teamPlayer.roundId, roundId), eq(teamPlayer.playerId, playerId))
    );

  const result = await db
    .insert(teamPlayer)
    .values({
      roundId,
      teamId,
      playerId,
    })
    .returning();

  revalidatePath("/");
  return result[0];
}

// Odebrání hráče z kola
export async function removePlayerFromTeamInRound(
  roundId: number,
  playerId: number
) {
  const result = await db
    .delete(teamPlayer)
    .where(
      and(eq(teamPlayer.roundId, roundId), eq(teamPlayer.playerId, playerId))
    )
    .returning();
  revalidatePath("/");
  return result[0];
}

// Získání soupisky týmů v daném kole
export async function getTeamPlayersForRound(roundId: number, teamId?: number) {
  const query = db
    .select({
      id: teamPlayer.id,
      roundId: teamPlayer.roundId,
      teamId: teamPlayer.teamId,
      playerId: player.id,
      playerName: player.name,
    })
    .from(teamPlayer)
    .innerJoin(player, eq(teamPlayer.playerId, player.id))
    .where(
      teamId
        ? and(eq(teamPlayer.roundId, roundId), eq(teamPlayer.teamId, teamId))
        : eq(teamPlayer.roundId, roundId)
    );

  return query;
}
