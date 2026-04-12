"use server";

import { getPlayersForTournamentId } from "@/actions/players";
import { getTeamsForTournamentSorted } from "@/actions/teams";
import { getTournamentById } from "@/actions/tournaments";

type TournamentColumn = {
  id: number;
  name: string;
  shortLabel: string;
};

type PivotRow = {
  name: string;
  values: number[];
};

type StatEntry = {
  name: string;
  value: number;
};

type TournamentStatsFromDb = {
  id: number;
  name: string;
  shortLabel: string;
  teamStats: StatEntry[];
  playerScoreStats: StatEntry[];
  playerBjStats: StatEntry[];
};

export type CombinedExportData = {
  tournaments: TournamentColumn[];
  teamRows: PivotRow[];
  playerScoreRows: PivotRow[];
  playerBjRows: PivotRow[];
};

function normalizeName(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function createShortLabel(name: string, fallbackIndex: number): string {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `T${fallbackIndex + 1}`;
}

function withUniqueNames(rows: StatEntry[]): StatEntry[] {
  const seenCounts: Record<string, number> = {};
  const uniqueRows: StatEntry[] = [];

  for (const row of rows) {
    if (!row.name) continue;
    const count = (seenCounts[row.name] ?? 0) + 1;
    seenCounts[row.name] = count;
    uniqueRows.push({
      name: count === 1 ? row.name : `${row.name} ${count}`,
      value: row.value,
    });
  }

  return uniqueRows;
}

function toPivotRows(
  names: string[],
  perTournamentStats: StatEntry[][]
): PivotRow[] {
  // Build all rows in one pass: name -> [valueForTournament1, valueForTournament2, ...]
  const rowValues: Record<string, number[]> = {};
  for (const name of names) {
    rowValues[name] = Array(perTournamentStats.length).fill(0);
  }

  perTournamentStats.forEach((stats, tournamentIndex) => {
    for (const entry of stats) {
      if (rowValues[entry.name]) {
        rowValues[entry.name][tournamentIndex] = entry.value;
      }
    }
  });

  return names.map((name) => ({ name, values: rowValues[name] }));
}

type PlayerStatsBundle = {
  playerScoreStats: StatEntry[];
  playerBjStats: StatEntry[];
};

async function loadTournamentStatsFromDb(
  tournamentId: number,
  index: number
): Promise<TournamentStatsFromDb> {
  // Reuse existing server actions to keep this easy to read.
  const [tournament, teamsSorted, playersRaw] = await Promise.all([
    getTournamentById(tournamentId),
    getTeamsForTournamentSorted(tournamentId),
    getPlayersForTournamentId(tournamentId),
  ]);

  const tournamentName =
    normalizeName(tournament?.name) || `Tournament ${tournamentId}`;

  const players = playersRaw.filter(
    (player): player is NonNullable<typeof player> => Boolean(player)
  );
  const playersSortedByScore = [...players].sort(
    (a, b) => toNumber(b.score) - toNumber(a.score)
  );
  const playersSortedByBlowjobs = [...players].sort(
    (a, b) => toNumber(b.blowjobs) - toNumber(a.blowjobs)
  );

  return {
    id: tournamentId,
    name: tournamentName,
    shortLabel: createShortLabel(tournamentName, index),
    teamStats: withUniqueNames(
      teamsSorted.map((team) => ({
        name: normalizeName(team.name),
        value: toNumber(team.score),
      }))
    ),
    playerScoreStats: withUniqueNames(
      playersSortedByScore.map((player) => ({
        name: normalizeName(player.name),
        value: toNumber(player.score),
      }))
    ),
    playerBjStats: withUniqueNames(
      playersSortedByBlowjobs.map((player) => ({
        name: normalizeName(player.name),
        value: toNumber(player.blowjobs),
      }))
    ),
  };
}

function sortByCombinedDesc(rows: PivotRow[]): PivotRow[] {
  return rows.sort((a, b) => {
    // "Combined" is the sum across all selected tournament columns.
    const combinedA = a.values.reduce((acc, value) => acc + value, 0);
    const combinedB = b.values.reduce((acc, value) => acc + value, 0);
    if (combinedB !== combinedA) {
      return combinedB - combinedA;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function getCombinedExportData(
  tournamentIds: number[]
): Promise<CombinedExportData> {
  const uniqueIds = Array.from(
    new Set(
      tournamentIds
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  );

  if (uniqueIds.length === 0) {
    return {
      tournaments: [],
      teamRows: [],
      playerScoreRows: [],
      playerBjRows: [],
    };
  }

  const tournamentStatsFromDb = await Promise.all(
    uniqueIds.map((id, index) => loadTournamentStatsFromDb(id, index))
  );

  const usedLabels: Record<string, number> = {};
  const tournaments: TournamentColumn[] = tournamentStatsFromDb.map((item) => {
    const currentCount = usedLabels[item.shortLabel] ?? 0;
    usedLabels[item.shortLabel] = currentCount + 1;

    const uniqueShortLabel =
      currentCount === 0 ? item.shortLabel : `${item.shortLabel}${currentCount + 1}`;

    return {
      id: item.id,
      name: item.name,
      shortLabel: uniqueShortLabel,
    };
  });

  const allTeamNames = new Set<string>();
  const allPlayerNames = new Set<string>();
  for (const item of tournamentStatsFromDb) {
    item.teamStats.forEach((entry) => allTeamNames.add(entry.name));
    item.playerScoreStats.forEach((entry) => allPlayerNames.add(entry.name));
    item.playerBjStats.forEach((entry) => allPlayerNames.add(entry.name));
  }

  const sortedTeamNames = Array.from(allTeamNames).sort((a, b) =>
    a.localeCompare(b)
  );
  const sortedPlayerNames = Array.from(allPlayerNames).sort((a, b) =>
    a.localeCompare(b)
  );

  const teamRows = toPivotRows(
    sortedTeamNames,
    tournamentStatsFromDb.map((item) => item.teamStats)
  );
  const playerScoreRows = toPivotRows(
    sortedPlayerNames,
    tournamentStatsFromDb.map((item) => item.playerScoreStats)
  );
  const playerBjRows = toPivotRows(
    sortedPlayerNames,
    tournamentStatsFromDb.map((item) => item.playerBjStats)
  );

  return {
    tournaments,
    teamRows: sortByCombinedDesc(teamRows),
    playerScoreRows: sortByCombinedDesc(playerScoreRows),
    playerBjRows: sortByCombinedDesc(playerBjRows),
  };
}
