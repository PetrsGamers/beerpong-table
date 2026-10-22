"use server";

import { db } from "@/db";
import { tournament } from "@/db/schema";
import { Tournament } from "@/db/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllTournaments() {
  return db.select().from(tournament);
}

export async function getTournamentsForSeason(seasonId: number) {
  return db
    .select()
    .from(tournament)
    .where(eq(tournament.seasonId, seasonId));
}

export async function getTournamentById(id: number) {
  const result = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, id))
    .limit(1);
  return result[0];
}

export async function createTournament(data: {
  name: string;
  seasonId: number;
}) {
  const result = await db
    .insert(tournament)
    .values({
      name: data.name,
      seasonId: data.seasonId,
    })
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function updateTournament(
  id: number,
  data: Partial<Tournament>
) {
  const result = await db
    .update(tournament)
    .set({
      ...(data.name ? { name: data.name } : {}),
      ...(data.seasonId ? { seasonId: data.seasonId } : {}),
    })
    .where(eq(tournament.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}

export async function deleteTournament(id: number) {
  const result = await db
    .delete(tournament)
    .where(eq(tournament.id, id))
    .returning();
  revalidatePath("/");
  return result[0];
}
