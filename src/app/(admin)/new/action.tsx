"use server";
import { tournament } from "@/db/schema";
import { eq } from "drizzle-orm"; // Replace "some-library" with the actual library name
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
    const result = await db
      .insert(tournament)
      .values({ name: tournamentName })
      .returning({ insertedId: tournament.id });
    revalidatePath("/");
    redirect("/" + result[0].insertedId);
  }
}
