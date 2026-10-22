"use client";

import { downloadCSVFile, escapeCSV } from "@/lib/csv";

export interface ExportCSVTeam {
  name: string | null;
  score: string | number | null;
}

export interface ExportCSVPlayer {
  name: string | null;
  score?: string | number | null;
  blowjobs?: string | number | null;
}

interface Props {
  teams: ExportCSVTeam[];
  playersByScore: ExportCSVPlayer[];
  playersByBlowjobs: ExportCSVPlayer[];
  tournamentName: string;
}

function ExportCSVButton({
  teams,
  playersByScore,
  playersByBlowjobs,
  tournamentName,
}: Props) {
  const handleExport = () => {
    const lines: string[] = [];

    // Team Rankings
    lines.push("Team Rankings");
    lines.push("Rank,Team,Score");
    teams.forEach((team, index) => {
      lines.push(`${index + 1},${escapeCSV(team.name ?? "")},${escapeCSV(team.score ?? "")}`);
    });

    lines.push("");

    // Top Scorers
    lines.push("Top Scorers");
    lines.push("Rank,Player,Score");
    playersByScore.forEach((player, index) => {
      lines.push(`${index + 1},${escapeCSV(player.name ?? "")},${escapeCSV(player.score ?? "")}`);
    });

    lines.push("");

    // BlowJob King
    lines.push("BlowJob King");
    lines.push("Rank,Player,Count");
    playersByBlowjobs.forEach((player, index) => {
      lines.push(`${index + 1},${escapeCSV(player.name ?? "")},${escapeCSV(player.blowjobs ?? "")}`);
    });

    const csvContent = lines.join("\n");

    const sanitizedName = tournamentName.replace(/\s+/g, "-");
    const filename = `${sanitizedName}-stats.csv`;
    downloadCSVFile(csvContent, filename);
  };

  return (
    <button onClick={handleExport} className="btn btn-primary">
      Export CSV
    </button>
  );
}

export default ExportCSVButton;
