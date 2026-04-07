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

function createUniqueName(
  name: string,
  seenCounts: Map<string, number>
): string {
  // Keep duplicate names distinct inside one tournament (e.g. "Petr", "Petr 2").
  const count = (seenCounts.get(name) ?? 0) + 1;
  seenCounts.set(name, count);
  return count === 1 ? name : `${name} ${count}`;
}

function mapFromStatsRows(rows: { name: string; value: number }[]): Map<string, number> {
  const result = new Map<string, number>();
  const seenCounts = new Map<string, number>();

  for (const row of rows) {
    if (!row.name) continue;

    const uniqueName = createUniqueName(row.name, seenCounts);
    result.set(uniqueName, row.value);
  }

  return result;
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

  const perTournament = await Promise.all(
    uniqueIds.map(async (id, index) => {
      const [tournament, teamsSorted, playersRaw] = await Promise.all([
        getTournamentById(id),
        getTeamsForTournamentSorted(id),
        getPlayersForTournamentId(id),
      ]);

      const tournamentName = normalizeName(tournament?.name) || `Tournament ${id}`;

      // Match stats page ordering logic before converting to name maps.
      const players = playersRaw.filter(
        (player): player is NonNullable<typeof player> => Boolean(player)
      );
      const playersSortedByScore = [...players].sort(
        (a, b) => toNumber(b.score) - toNumber(a.score)
      );
      const playersSortedByBlowjobs = [...players].sort(
        (a, b) => toNumber(b.blowjobs) - toNumber(a.blowjobs)
      );

      // Build name->value maps from the same sources used by /[tournamentid]/stats.
      const teamMap = mapFromStatsRows(
        teamsSorted.map((team) => ({
          name: normalizeName(team.name),
          value: toNumber(team.score),
        }))
      );
      const playerScoreMap = mapFromStatsRows(
        playersSortedByScore.map((player) => ({
          name: normalizeName(player.name),
          value: toNumber(player.score),
        }))
      );
      const playerBjMap = mapFromStatsRows(
        playersSortedByBlowjobs.map((player) => ({
          name: normalizeName(player.name),
          value: toNumber(player.blowjobs),
        }))
      );

      return {
        id,
        name: tournamentName,
        shortLabel: createShortLabel(tournamentName, index),
        teamMap,
        playerScoreMap,
        playerBjMap,
      };
    })
  );

  const usedLabels = new Map<string, number>();
  const tournaments: TournamentColumn[] = perTournament.map((item) => {
    const currentCount = usedLabels.get(item.shortLabel) ?? 0;
    usedLabels.set(item.shortLabel, currentCount + 1);

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
  for (const item of perTournament) {
    item.teamMap.forEach((_, name) => allTeamNames.add(name));
    item.playerScoreMap.forEach((_, name) => allPlayerNames.add(name));
    item.playerBjMap.forEach((_, name) => allPlayerNames.add(name));
  }

  const sortedTeamNames = Array.from(allTeamNames).sort((a, b) =>
    a.localeCompare(b)
  );
  const sortedPlayerNames = Array.from(allPlayerNames).sort((a, b) =>
    a.localeCompare(b)
  );

  const teamRows: PivotRow[] = sortedTeamNames.map((name) => ({
    name,
    values: perTournament.map((item) => item.teamMap.get(name) ?? 0),
  }));
  const playerScoreRows: PivotRow[] = sortedPlayerNames.map((name) => ({
    name,
    values: perTournament.map((item) => item.playerScoreMap.get(name) ?? 0),
  }));
  const playerBjRows: PivotRow[] = sortedPlayerNames.map((name) => ({
    name,
    values: perTournament.map((item) => item.playerBjMap.get(name) ?? 0),
  }));

  return {
    tournaments,
    teamRows: sortByCombinedDesc(teamRows),
    playerScoreRows: sortByCombinedDesc(playerScoreRows),
    playerBjRows: sortByCombinedDesc(playerBjRows),
  };
}
