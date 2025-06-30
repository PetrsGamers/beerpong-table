import { db } from "@/db";
import { season, tournament } from "@/db/schema";

export async function getAllSeasons() {
  const seasons = await db.select().from(season);
  return seasons;
}
