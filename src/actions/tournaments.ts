'use server'

import { db } from "@/db";
import { tournament } from "@/db/schema";

export async function getAllTournaments() {
    const tournaments = await db
        .select()
        .from(tournament);
    return tournaments;
};