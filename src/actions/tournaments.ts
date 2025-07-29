"use server";

import { db } from "@/db";
import { tournament } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllTournaments() {
  const tournaments = await db.select().from(tournament);
  return tournaments;
}

export async function createTournament(name: string) {
  const newTournament = await db
    .insert(tournament)
    .values({ name })
    .returning();
  return newTournament[0];
}

export async function getTournamentById(id: number) {
  const tournamentData = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, id))
    .limit(1);
  return tournamentData[0];
}

export async function updateTournament(id: number, name: string) {
  const updatedTournament = await db
    .update(tournament)
    .set({ name })
    .where(eq(tournament.id, id))
    .returning();
  return updatedTournament[0];
}

export async function deleteTournament(id: number) {
  const deletedTournament = await db
    .delete(tournament)
    .where(eq(tournament.id, id))
    .returning();
  return deletedTournament[0];
}
