"use server";
import { db } from "@/db";
import { match, player, team } from "@/db/schema";
import { aliasedTable, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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
    .leftJoin(player1, eq(team.player1_id, player1.id))    .leftJoin(player2, eq(team.player2_id, player2.id)).where(eq(team.tournament_id, id));

  return teams;
}

export async function deleteTeam(id: number) {
    const tournamentId = await db.delete(team).where(eq(team.id, id)).returning({ deletedId: team.tournament_id });
    redirect("/" + tournamentId[0].deletedId);
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
        .where(eq(match.tournament_id, tournamentId))

    const teamList: Team[] = [];

    for (const match of matches) {

        const scores = match.score?.split(":");
        if (scores === undefined) {
            continue;
        }
        if (scores[0] > scores[1]) {
            const team1 = teamList.find((team) => team.id === match.team1_id);
            if (team1) {
                team1.score += 2;
            } else if (match.team1_id !== null) {
                const teamName = await db.select().from(team).where(eq(team.id, match.team1_id));
                teamList.push({ id: match.team1_id, score: 2, name: teamName[0].name??"" });
            }

            const team2 = teamList.find((team) => team.id === match.team2_id);
            if (team2) {
                team2.score += 0;
            } else if (match.team2_id !== null) {
                const teamName = await db.select().from(team).where(eq(team.id, match.team2_id));
                teamList.push({ id: match.team2_id, score: 0, name: teamName[0].name??"" });
            }
        }
        if (scores[0] === scores[1])
        {
            const team1 = teamList.find((team) => team.id === match.team1_id);
            if (team1) {
                team1.score += 1;
            } else if (match.team1_id !== null) {
                const teamName = await db.select().from(team).where(eq(team.id, match.team1_id));
                teamList.push({ id: match.team1_id, score: 1, name: teamName[0].name??"" });
            }

            const team2 = teamList.find((team) => team.id === match.team2_id);
            if (team2) {
                team2.score += 1;
            } else if (match.team2_id !== null) {
                const teamName = await db.select().from(team).where(eq(team.id, match.team2_id));
                teamList.push({ id: match.team2_id, score: 1, name: teamName[0].name??"" });
            }
        }
        }
  
    return teamList.sort((a, b) => b.score - a.score);
}   
      