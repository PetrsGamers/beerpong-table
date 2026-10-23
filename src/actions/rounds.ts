"use server";

import { db } from "@/db";
import { round } from "@/db/schema";
import { Round } from "@/db/types";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRoundsForSeason(seasonId: number) {
  return db
    .select()
    .from(round)
    .where(eq(round.seasonId, seasonId))
    .orderBy(asc(round.roundNumber));
}

export async function getRoundById(id: number) {
  const result = await db
    .select()
    .from(round)
    .where(eq(round.id, id))
    .limit(1);
  return result[0];
}

export async function createRound(data: {
  name: string;
  seasonId: number;
  roundNumber?: number;
  date?: Date;
}) {
  const result = await db
    .insert(round)
    .values({
      name: data.name,
      seasonId: data.seasonId,
      roundNumber: data.roundNumber ?? 1,
      date: data.date,
    })
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function updateRound(id: number, data: Partial<Round>) {
  const result = await db
    .update(round)
    .set({
      ...(data.name ? { name: data.name } : {}),
      ...(data.roundNumber !== undefined
        ? { roundNumber: data.roundNumber }
        : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.isCompleted !== undefined
        ? { isCompleted: data.isCompleted }
        : {}),
    })
    .where(eq(round.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function deleteRound(id: number) {
  const result = await db
    .delete(round)
    .where(eq(round.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}
