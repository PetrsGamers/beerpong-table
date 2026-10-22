"use server";

import { db } from "@/db";
import { round } from "@/db/schema";
import { Round } from "@/db/types";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRoundsForTournament(tournamentId: number) {
  return db
    .select()
    .from(round)
    .where(eq(round.tournamentId, tournamentId))
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
  tournamentId: number;
  roundNumber?: number;
}) {
  const result = await db
    .insert(round)
    .values({
      name: data.name,
      tournamentId: data.tournamentId,
      roundNumber: data.roundNumber ?? 1,
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
    })
    .where(eq(round.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function deleteRound(id: number) {
  const result = await db.delete(round).where(eq(round.id, id)).returning();
  revalidatePath("/");
  return result[0];
}
