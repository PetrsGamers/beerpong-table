"use server";

import { db } from "@/db";
import {
  match,
  player,
  playerMatchScore,
  round,
  team,
  tournament,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// 1. Skóre hráčů v rámci jednoho zápasu
export async function getPlayerScoresForMatch(matchId: number) {
  return db
    .select({
      id: playerMatchScore.id,
      matchId: playerMatchScore.matchId,
      playerId: player.id,
      playerName: player.name,
      teamId: team.id,
      teamName: team.name,
      score: playerMatchScore.score,
      blowjobs: playerMatchScore.blowjobs,
    })
    .from(playerMatchScore)
    .innerJoin(player, eq(playerMatchScore.playerId, player.id))
    .innerJoin(team, eq(playerMatchScore.teamId, team.id))
    .where(eq(playerMatchScore.matchId, matchId));
}

// 2. Žebříček hráčů v rámci turnaje (Král střelců & BlowJob King)
export async function getTournamentPlayerLeaderboard(tournamentId: number) {
  return db
    .select({
      playerId: player.id,
      playerName: player.name,
      totalScore: sql<number>`COALESCE(SUM(${playerMatchScore.score}), 0)::int`,
      totalBlowjobs: sql<number>`COALESCE(SUM(${playerMatchScore.blowjobs}), 0)::int`,
      matchesPlayed: sql<number>`COUNT(DISTINCT ${playerMatchScore.matchId})::int`,
    })
    .from(player)
    .innerJoin(playerMatchScore, eq(player.id, playerMatchScore.playerId))
    .innerJoin(match, eq(playerMatchScore.matchId, match.id))
    .innerJoin(round, eq(match.roundId, round.id))
    .where(eq(round.tournamentId, tournamentId))
    .groupBy(player.id, player.name)
    .orderBy(
      desc(sql`SUM(${playerMatchScore.score})`),
      desc(sql`SUM(${playerMatchScore.blowjobs})`)
    );
}

// 3. Žebříček hráčů v rámci celé sezóny (Král střelců & BlowJob King za sezónu)
export async function getSeasonPlayerLeaderboard(seasonId: number) {
  return db
    .select({
      playerId: player.id,
      playerName: player.name,
      totalScore: sql<number>`COALESCE(SUM(${playerMatchScore.score}), 0)::int`,
      totalBlowjobs: sql<number>`COALESCE(SUM(${playerMatchScore.blowjobs}), 0)::int`,
      matchesPlayed: sql<number>`COUNT(DISTINCT ${playerMatchScore.matchId})::int`,
    })
    .from(player)
    .innerJoin(playerMatchScore, eq(player.id, playerMatchScore.playerId))
    .innerJoin(match, eq(playerMatchScore.matchId, match.id))
    .innerJoin(round, eq(match.roundId, round.id))
    .innerJoin(tournament, eq(round.tournamentId, tournament.id))
    .where(eq(tournament.seasonId, seasonId))
    .groupBy(player.id, player.name)
    .orderBy(
      desc(sql`SUM(${playerMatchScore.score})`),
      desc(sql`SUM(${playerMatchScore.blowjobs})`)
    );
}

export type TeamStanding = {
  teamId: number;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  cupsScored: number;
  cupsConceded: number;
  cupDiff: number;
  points: number;
};

// 4. Tabulka týmů pro turnaj
export async function getTournamentTeamStandings(
  tournamentId: number
): Promise<TeamStanding[]> {
  const matches = await db
    .select({
      matchId: match.id,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
      status: match.status,
    })
    .from(match)
    .innerJoin(round, eq(match.roundId, round.id))
    .where(eq(round.tournamentId, tournamentId));

  const allTeams = await db.select().from(team);
  const teamMap = new Map<number, string>(allTeams.map((t) => [t.id, t.name]));

  const standingsMap = new Map<number, TeamStanding>();

  function getOrCreate(teamId: number): TeamStanding {
    if (!standingsMap.has(teamId)) {
      standingsMap.set(teamId, {
        teamId,
        teamName: teamMap.get(teamId) ?? `Tým #${teamId}`,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        cupsScored: 0,
        cupsConceded: 0,
        cupDiff: 0,
        points: 0,
      });
    }
    return standingsMap.get(teamId)!;
  }

  for (const m of matches) {
    const t1 = getOrCreate(m.team1Id);
    const t2 = getOrCreate(m.team2Id);

    t1.played += 1;
    t2.played += 1;
    t1.cupsScored += m.team1Score;
    t1.cupsConceded += m.team2Score;
    t2.cupsScored += m.team2Score;
    t2.cupsConceded += m.team1Score;

    if (m.team1Score > m.team2Score) {
      t1.wins += 1;
      t1.points += 2;
      t2.losses += 1;
    } else if (m.team2Score > m.team1Score) {
      t2.wins += 1;
      t2.points += 2;
      t1.losses += 1;
    } else {
      t1.draws += 1;
      t1.points += 1;
      t2.draws += 1;
      t2.points += 1;
    }

    t1.cupDiff = t1.cupsScored - t1.cupsConceded;
    t2.cupDiff = t2.cupsScored - t2.cupsConceded;
  }

  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.cupDiff !== a.cupDiff) return b.cupDiff - a.cupDiff;
    return b.cupsScored - a.cupsScored;
  });
}

// 5. Celková tabulka týmů pro sezónu
export async function getSeasonTeamStandings(
  seasonId: number
): Promise<TeamStanding[]> {
  const matches = await db
    .select({
      matchId: match.id,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
      status: match.status,
    })
    .from(match)
    .innerJoin(round, eq(match.roundId, round.id))
    .innerJoin(tournament, eq(round.tournamentId, tournament.id))
    .where(eq(tournament.seasonId, seasonId));

  const seasonTeams = await db
    .select()
    .from(team)
    .where(eq(team.seasonId, seasonId));

  const standingsMap = new Map<number, TeamStanding>();

  for (const t of seasonTeams) {
    standingsMap.set(t.id, {
      teamId: t.id,
      teamName: t.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      cupsScored: 0,
      cupsConceded: 0,
      cupDiff: 0,
      points: 0,
    });
  }

  for (const m of matches) {
    const t1 = standingsMap.get(m.team1Id);
    const t2 = standingsMap.get(m.team2Id);
    if (!t1 || !t2) continue;

    t1.played += 1;
    t2.played += 1;
    t1.cupsScored += m.team1Score;
    t1.cupsConceded += m.team2Score;
    t2.cupsScored += m.team2Score;
    t2.cupsConceded += m.team1Score;

    if (m.team1Score > m.team2Score) {
      t1.wins += 1;
      t1.points += 2;
      t2.losses += 1;
    } else if (m.team2Score > m.team1Score) {
      t2.wins += 1;
      t2.points += 2;
      t1.losses += 1;
    } else {
      t1.draws += 1;
      t1.points += 1;
      t2.draws += 1;
      t2.points += 1;
    }

    t1.cupDiff = t1.cupsScored - t1.cupsConceded;
    t2.cupDiff = t2.cupsScored - t2.cupsConceded;
  }

  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.cupDiff !== a.cupDiff) return b.cupDiff - a.cupDiff;
    return b.cupsScored - a.cupsScored;
  });
}
