"use client";

interface Team {
  id: number;
  name: string;
  score: number;
}

interface Player {
  id: number;
  name: string | null;
  score: string | null;
  blowjobs: string | null;
}

interface Props {
  teams: Team[];
  playersByScore: Player[];
  playersByBlowjobs: Player[];
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
      lines.push(`${index + 1},${team.name ?? ""},${team.score ?? 0}`);
    });

    lines.push("");

    // Top Scorers
    lines.push("Top Scorers");
    lines.push("Rank,Player,Score");
    playersByScore.forEach((player, index) => {
      lines.push(`${index + 1},${player.name ?? ""},${player.score ?? 0}`);
    });

    lines.push("");

    // BlowJob King
    lines.push("BlowJob King");
    lines.push("Rank,Player,Count");
    playersByBlowjobs.forEach((player, index) => {
      lines.push(`${index + 1},${player.name ?? ""},${player.blowjobs ?? 0}`);
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
