"use server";

import { db } from "@/db";
import { season } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllSeasons() {
  return db.select().from(season);
}

export async function createSeason(name: string) {
  const newSeason = await db.insert(season).values({ name }).returning();
  return newSeason[0];
}

export async function getSeasonById(id: number) {
  const seasonData = await db
    .select()
    .from(season)
    .where(eq(season.id, id))
    .limit(1);
  return seasonData[0];
}

export async function updateSeason(id: number, name: string) {
  const updatedSeason = await db
    .update(season)
    .set({ name })
    .where(eq(season.id, id))
    .returning();
  return updatedSeason[0];
}

export async function deleteSeason(id: number) {
  const deletedSeason = await db
    .delete(season)
    .where(eq(season.id, id))
    .returning();
  revalidatePath("/");
  return deletedSeason[0];
}
