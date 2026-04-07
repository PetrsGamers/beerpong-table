"use server";

import { match, player, team, tournament } from "@/db/schema";
import { MatchWithTeams } from "@/types/match";
import { aliasedTable, and, eq } from "drizzle-orm"; // Replace "some-library" with the actual library name
import { revalidatePath } from "next/cache";
import { db } from "../../db";

export async function loadMatches(
  id: number
): Promise<MatchWithTeams[]> {
  const team1 = aliasedTable(team, "team1");
  const team2 = aliasedTable(team, "team2");

  const matches = await db
    .select({
      match: match,
      team1: team1,
      team2: team2,
    })
    .from(match)
    .where(eq(match.tournament_id, id))
    .leftJoin(team1, eq(match.team1_id, team1.id))
    .leftJoin(team2, eq(match.team2_id, team2.id));

  return matches
    .filter(
      (item) =>
        item.match.tournament_id !== null &&
        item.match.team1_id !== null &&
        item.match.team2_id !== null
    )
    .map((item) => ({
      match: {
        id: item.match.id,
        score: item.match.score ?? "",
        tournament_id: item.match.tournament_id as number,
        team1_id: item.match.team1_id as number,
        team2_id: item.match.team2_id as number,
      },
      team1: item.team1
        ? {
            id: item.team1.id,
            name: item.team1.name ?? "",
            score: item.team1.score ?? "",
            player1_id: item.team1.player1_id,
            player2_id: item.team1.player2_id,
            tournament_id: item.team1.tournament_id ?? id,
          }
        : undefined,
      team2: item.team2
        ? {
            id: item.team2.id,
            name: item.team2.name ?? "",
            score: item.team2.score ?? "",
            player1_id: item.team2.player1_id,
            player2_id: item.team2.player2_id,
            tournament_id: item.team2.tournament_id ?? id,
          }
        : undefined,
    }));
}

export async function loadTournament(id: number) {
  const tournamentData = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, id));
  return tournamentData.length > 0 ? tournamentData[0] : null;
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
