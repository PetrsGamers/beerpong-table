"use client";

import { PlayerStats } from "@/actions/players";
import { TeamStats } from "@/actions/teams";

interface Props {
  teams: TeamStats[];
  playersByScore: PlayerStats[];
  playersByBlowjobs: PlayerStats[];
  tournamentName: string;
}

function escapeCSV(value: string | number | null | undefined): string {
  const str = String(value ?? "");

  if (/[,"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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
      lines.push(`${index + 1},${escapeCSV(team.name)},${escapeCSV(team.score)}`);
    });

    lines.push("");

    // Top Scorers
    lines.push("Top Scorers");
    lines.push("Rank,Player,Score");
    playersByScore.forEach((player, index) => {
      lines.push(`${index + 1},${escapeCSV(player.name)},${escapeCSV(player.score)}`);
    });

    lines.push("");

    // BlowJob King
    lines.push("BlowJob King");
    lines.push("Rank,Player,Count");
    playersByBlowjobs.forEach((player, index) => {
      lines.push(`${index + 1},${escapeCSV(player.name)},${escapeCSV(player.blowjobs)}`);
    });

    const csvContent = lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const sanitizedName = tournamentName.replace(/\s+/g, "-");
    const filename = `${sanitizedName}-stats.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="btn btn-primary">
      Export CSV
    </button>
  );
}

export default ExportCSVButton;
