"use server";

import { match, player, team, tournament } from "@/db/schema";
import { aliasedTable, and, eq } from "drizzle-orm"; // Replace "some-library" with the actual library name
import { revalidatePath } from "next/cache";
import { db } from "../../db";

export async function loadMatches(id: number) {
  const team1 = aliasedTable(team, "team1");
  const team2 = aliasedTable(team, "team2");
  const matches = await db
    .select()
    .from(match)
    .where(eq(match.tournament_id, id))
    .leftJoin(team1, eq(match.team1_id, team1.id))
    .leftJoin(team2, eq(match.team2_id, team2.id));
  if (matches.length === 0) {
    return null;
  }
  console.log(matches);
  return matches;
}
export async function loadTournament(id: number) {
  const tournamentData = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, id));
  return tournamentData[0];
}

export async function findTeamCount(id: number) {
  const teamCount = await db
    .select()
    .from(team)
    .where(eq(team.tournament_id, id));
  return teamCount.length;
}

export async function createTeam(formData: FormData) {
  const teamName = formData.get("team") as string;
  const player1 = formData.get("player1") as string;
  const player2 = formData.get("player2") as string;
  const tournamentId = formData.get("tournamentId");
  if (!teamName || !player1 || !player2) {
    return { error: "Zadej všechny údaje o týmu" };
  }

  const teamExist = await db
    .select()
    .from(team)
    .where(
      and(eq(team.name, teamName), eq(team.tournament_id, Number(tournamentId)))
    );
  if (teamExist.length !== 0) {
    return { error: "Tym existuje" + teamName };
  }

  let TeamId;
  try {
    const result = await db
      .insert(team)
      .values({
        name: teamName,
        tournament_id: Number(tournamentId),
      })
      .returning({ insertedId: team.id });
    TeamId = result[0].insertedId;
  } catch (error) {
    return { error: "Failed to create team " + error };
  }

  try {
    const player1ID = await db
      .insert(player)
      .values({
        name: player1,
      })
      .returning({ insertedId: player.id });
    const player2ID = await db
      .insert(player)
      .values({
        name: player2,
      })
      .returning({ insertedId: player.id });
    await db
      .update(team)
      .set({
        player1_id: player1ID[0].insertedId,
        player2_id: player2ID[0].insertedId,
      })
      .where(eq(team.id, TeamId));
  } catch (error) {
    return { error: "Failed to create players" + error };
  }
  revalidatePath("/" + tournamentId);

  return { success: "Tým " + teamName + " byl vytvořen" };
}
