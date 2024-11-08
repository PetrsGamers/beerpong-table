"use server";
import { db } from "@/db";
import { player, team } from "@/db/schema";
import { aliasedTable, eq } from "drizzle-orm";
export async function loadAllTeams(id: number) {
    const player1 = aliasedTable(player, "player1");
    const player2 = aliasedTable(player, "player2");

    console.log("id", id);
    const teams = await db
    .select()
    .from(team)
    .leftJoin(player1, eq(team.player1_id, player1.id))
    .leftJoin(player2, eq(team.player2_id, player2.id)).where(eq(team.tournament_id, id));

  return teams;
}

export async function deleteTeam(id: number) {
    const result = await db.delete(team).where(eq(team.id, id));
    return result;
    }