'use server'

import { db } from "@/db";
import { tournament } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllTournaments() {
    const tournaments = await db
        .select()
        .from(tournament);
    return tournaments;
};

export async function getTournamentById(id: number) {
    const result = await db
        .select()
        .from(tournament)
        .where(eq(tournament.id, id));
    return result[0] ?? null;
}