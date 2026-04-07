"use client";

import { getCombinedExportData } from "@/actions/export";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMemo, useState, useTransition } from "react";

type Tournament = {
  id: number;
  name: string | null;
};

type PivotRow = {
  name: string;
  values: number[];
};

function escapeCSV(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  if (/[,"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCSVLine(name: string, values: number[]): string {
  const combined = values.reduce((acc, current) => acc + Number(current || 0), 0);
  return [escapeCSV(name), ...values.map((value) => escapeCSV(value)), combined].join(
    ","
  );
}

function appendPivotSection(
  lines: string[],
  sectionTitle: string,
  firstHeader: string,
  tournamentHeaders: string[],
  rows: PivotRow[]
) {
  lines.push(sectionTitle);
  lines.push([firstHeader, ...tournamentHeaders, "Combined"].join(","));

  for (const row of rows) {
    lines.push(rowToCSVLine(row.name, row.values));
  }
  lines.push("");
}

export default function MultiTournamentExport({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();

  const selectedCount = selectedIds.length;

  const orderedTournaments = useMemo(
    () => [...tournaments].sort((a, b) => Number(a.id) - Number(b.id)),
    [tournaments]
  );

  const toggleTournament = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const handleExport = () => {
    if (selectedIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const data = await getCombinedExportData(selectedIds);
      const lines: string[] = [];
      const tournamentHeaders = data.tournaments.map((item) => item.shortLabel);

      appendPivotSection(
        lines,
        "Team scores",
        "TeamName",
        tournamentHeaders,
        data.teamRows
      );
      appendPivotSection(
        lines,
        "Player scores",
        "PlayerName",
        tournamentHeaders,
        data.playerScoreRows
      );
      appendPivotSection(
        lines,
        "Player BJ",
        "PlayerName",
        tournamentHeaders,
        data.playerBjRows
      );

      const csvContent = lines.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const filename = `multi-tournament-stats-${data.tournaments.length}.csv`;
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="btn btn-primary">
          Export Combined CSV{selectedCount ? ` (${selectedCount})` : ""}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-base-100 max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Multi-tournament CSV export</AlertDialogTitle>
          <AlertDialogDescription>
            Select tournaments to export Team scores, Player scores and Player BJ.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-80 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {orderedTournaments.map((tournament) => (
            <label
              key={tournament.id}
              className="flex items-center gap-2 border border-base-300 rounded px-3 py-2"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(tournament.id)}
                onChange={() => toggleTournament(tournament.id)}
              />
              <span>{tournament.name ?? `Tournament ${tournament.id}`}</span>
            </label>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="btn btn-outline">Close</AlertDialogCancel>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={isPending || selectedCount === 0}
          >
            {isPending
              ? "Preparing CSV..."
              : `Export${selectedCount ? ` (${selectedCount})` : ""}`}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
