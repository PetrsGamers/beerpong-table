import { db } from "@/db";
import { season, tournament } from "@/db/schema";

export async function getAllSeasons() {
  return db.select().from(season);
}
