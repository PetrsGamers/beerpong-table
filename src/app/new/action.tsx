"use server";
import { tournament, season } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../../db";

export async function createTournament(formData: FormData) {
  const tournamentName = formData.get("tournamentName") as string | null;
  if (!tournamentName) {
    return { error: "Chybí jméno turnaje" };
  }
  const vysledek = await db
    .select()
    .from(tournament)
    .where(eq(tournament.name, tournamentName));

  if (vysledek.length > 0) {
    return { error: "Turnaj s tímto jménem již existuje" };
  } else {
    let seasonId = 1;
    const latestSeason = await db
      .select({ id: season.id })
      .from(season)
      .orderBy(desc(season.id))
      .limit(1);

    if (latestSeason[0]) {
      seasonId = latestSeason[0].id;
    } else {
      const [newS] = await db
        .insert(season)
        .values({ name: "Výchozí sezóna" })
        .returning();
      seasonId = newS.id;
    }

    const result = await db
      .insert(tournament)
      .values({ name: tournamentName, seasonId })
      .returning({ insertedId: tournament.id });
    revalidatePath("/");
    redirect(`/seasons/${seasonId}/tournaments`);
  }
}
