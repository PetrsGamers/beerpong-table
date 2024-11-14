"use server";
import { db } from "@/db";
import { match, player, team } from "@/db/schema";
import { aliasedTable, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type Team = {
  id: number;
  score: number;
  name: string;
};
export async function loadAllTeams(id: number) {
  const player1 = aliasedTable(player, "player1");
  const player2 = aliasedTable(player, "player2");

  console.log("id", id);
  const teams = await db
    .select()
    .from(team)
    .leftJoin(player1, eq(team.player1_id, player1.id))
    .leftJoin(player2, eq(team.player2_id, player2.id))
    .where(eq(team.tournament_id, id));

  return teams;
}

export async function deleteTeam(id: number) {
  const result = await db.delete(team).where(eq(team.id, id));
  revalidatePath(`/${id}`);
}

export const getTeamsForTournament = async (tournamentId: number) => {
  const teams = await db
    .select()
    .from(team)
    .where(eq(team.tournament_id, tournamentId));
  return teams;
};

export const getTeamsForTournamentSorted = async (tournamentId: number) => {
  const matches = await db
    .select()
    .from(match)
    .where(eq(match.tournament_id, tournamentId));

  const teamList: Team[] = [];

  for (const match of matches) {
    const scores = match.score?.split(":");
    console.log("scores", scores);
    if (scores === undefined) {
      console.log("scores undefined");
      continue;
    }
    if (Number(scores[0]) > Number(scores[1])) {
      const team1 = teamList.find((team) => team.id === match.team1_id);
      if (team1) {
        team1.score += 2;
      } else if (match.team1_id !== null) {
        const teamName = await db
          .select()
          .from(team)
          .where(eq(team.id, match.team1_id));
        teamList.push({
          id: match.team1_id,
          score: 2,
          name: teamName[0].name ?? "",
        });
      }

      const team2 = teamList.find((team) => team.id === match.team2_id);
      if (team2) {
        team2.score += 0;
      } else if (match.team2_id !== null) {
        const teamName = await db
          .select()
          .from(team)
          .where(eq(team.id, match.team2_id));
        teamList.push({
          id: match.team2_id,
          score: 0,
          name: teamName[0].name ?? "",
        });
      }
    }
    if (Number(scores[0]) < Number(scores[1])) {
      const team1 = teamList.find((team) => team.id === match.team1_id);
      if (team1) {
        team1.score += 0;
      } else if (match.team1_id !== null) {
        const teamName = await db
          .select()
          .from(team)
          .where(eq(team.id, match.team1_id));
        teamList.push({
          id: match.team1_id,
          score: 0,
          name: teamName[0].name ?? "",
        });
      }

      const team2 = teamList.find((team) => team.id === match.team2_id);
      if (team2) {
        team2.score += 2;
      } else if (match.team2_id !== null) {
        const teamName = await db
          .select()
          .from(team)
          .where(eq(team.id, match.team2_id));
        teamList.push({
          id: match.team2_id,
          score: 2,
          name: teamName[0].name ?? "",
        });
      }
    }
    if (scores[0] === scores[1]) {
      const team1 = teamList.find((team) => team.id === match.team1_id);
      if (team1) {
        team1.score += 1;
      } else if (match.team1_id !== null) {
        const teamName = await db
          .select()
          .from(team)
          .where(eq(team.id, match.team1_id));
        teamList.push({
          id: match.team1_id,
          score: 1,
          name: teamName[0].name ?? "",
        });
      }

      const team2 = teamList.find((team) => team.id === match.team2_id);
      if (team2) {
        team2.score += 1;
      } else if (match.team2_id !== null) {
        const teamName = await db
          .select()
          .from(team)
          .where(eq(team.id, match.team2_id));
        teamList.push({
          id: match.team2_id,
          score: 1,
          name: teamName[0].name ?? "",
        });
      }
    }
    else{

    }
  }
  console.log("teamList", teamList);

  return teamList.sort((a, b) => b.score - a.score);
};

// export const deleteTeam = async (teamId: number) => {
//   const tournament_id = await db
//     .delete(team)
//     .where(eq(team.id, teamId))
//     .returning({ tournamentid: team.tournament_id });
//   redirect("/" + tournament_id[0].tournamentid);
// };
