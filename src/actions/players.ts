"use server";

import { db } from "@/db";
import { player } from "@/db/schema";
import { Player } from "@/db/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
