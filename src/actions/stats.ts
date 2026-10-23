"use server";

import { db } from "@/db";
import {
  match,
  player,
  playerMatchScore,
  round,
  team,
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

// 2. Žebříček hráčů v rámci kola / večera (Král střelců & BlowJob King večera)
export async function getRoundPlayerLeaderboard(roundId: number) {
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
    .where(eq(match.roundId, roundId))
    .groupBy(player.id, player.name)
    .orderBy(
      desc(sql`SUM(${playerMatchScore.score})`),
      desc(sql`SUM(${playerMatchScore.blowjobs})`)
    );
}

// 3. Žebříček hráčů v rámci celé sezóny / semestru (Král střelců & BlowJob King semestru)
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
    .where(eq(round.seasonId, seasonId))
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

// 4. Tabulka týmů pro konkrétní kolo / turnajový večer
export async function getRoundTeamStandings(
  roundId: number
): Promise<TeamStanding[]> {
  const matches = await db
    .select({
      matchId: match.id,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
    })
    .from(match)
    .where(eq(match.roundId, roundId));

  return calculateStandings(matches);
}

// 5. Celková ligová tabulka týmů pro celou sezónu / semestr (součet za všech 5 kol)
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
    })
    .from(match)
    .innerJoin(round, eq(match.roundId, round.id))
    .where(eq(round.seasonId, seasonId));

  return calculateStandings(matches);
}

// Pomocná funkce pro výpočet ligové tabulky (3 body výhra, 1 remíza, 0 prohra)
async function calculateStandings(
  matches: {
    matchId: number;
    team1Id: number;
    team2Id: number;
    team1Score: number;
    team2Score: number;
  }[]
): Promise<TeamStanding[]> {
  const allTeams = await db.select().from(team);
  const teamMap = new Map<number, string>(allTeams.map((t) => [t.id, t.name]));

  const standingsMap = new Map<number, TeamStanding>();

  for (const m of matches) {
    if (!standingsMap.has(m.team1Id)) {
      standingsMap.set(m.team1Id, {
        teamId: m.team1Id,
        teamName: teamMap.get(m.team1Id) ?? `Tým #${m.team1Id}`,
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

    if (!standingsMap.has(m.team2Id)) {
      standingsMap.set(m.team2Id, {
        teamId: m.team2Id,
        teamName: teamMap.get(m.team2Id) ?? `Tým #${m.team2Id}`,
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

    const t1 = standingsMap.get(m.team1Id)!;
    const t2 = standingsMap.get(m.team2Id)!;

    t1.played += 1;
    t2.played += 1;

    t1.cupsScored += m.team1Score;
    t1.cupsConceded += m.team2Score;

    t2.cupsScored += m.team2Score;
    t2.cupsConceded += m.team1Score;

    if (m.team1Score > m.team2Score) {
      t1.wins += 1;
      t1.points += 3;
      t2.losses += 1;
    } else if (m.team1Score < m.team2Score) {
      t2.wins += 1;
      t2.points += 3;
      t1.losses += 1;
    } else {
      t1.draws += 1;
      t1.points += 1;
      t2.draws += 1;
      t2.points += 1;
    }
  }

  const list = Array.from(standingsMap.values());

  for (const t of list) {
    t.cupDiff = t.cupsScored - t.cupsConceded;
  }

  return list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.cupDiff !== a.cupDiff) return b.cupDiff - a.cupDiff;
    return b.cupsScored - a.cupsScored;
  });
}
