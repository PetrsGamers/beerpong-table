"use client";
import { deleteSchedule, ScheduledMatchWithResult } from "@/actions/schedule";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  downloadSchedulePdf,
  downloadScheduleSlidesPdf,
} from "@/lib/schedulePdf";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { ScheduleGenerateForm } from "./scheduleGenerateForm";

type Props = {
  tournamentId: number;
  tournamentName: string;
  isOutdated: boolean;
  schedule: ScheduledMatchWithResult[];
  // rendered between the schedule and its settings, e.g. played matches
  children?: ReactNode;
};

const scoreInputHref = (tournamentId: number, m: ScheduledMatchWithResult) =>
  `/${tournamentId}/new?team1=${m.team1Id}&team2=${m.team2Id}`;

// a match from the current round, large enough to tap at the table
const CurrentMatchCard = ({
  tournamentId,
  match,
}: {
  tournamentId: number;
  match: ScheduledMatchWithResult;
}) => {
  const content = (
    <>
      <div className="text-sm text-gray-400 mb-2">Stůl {match.tableNumber}</div>
      <div className="flex items-center justify-between gap-3 text-lg font-semibold">
        <span className="flex-1 text-right">{match.team1Name}</span>
        <span
          className={
            match.score ? "text-green-500 text-nowrap" : "text-gray-500 text-sm"
          }
        >
          {match.score ?? "vs"}
        </span>
        <span className="flex-1">{match.team2Name}</span>
      </div>
      <div className="mt-3 text-sm text-center">
        {match.score ? (
          <span className="text-green-500">Odehráno</span>
        ) : (
          <span className="text-blue-400">Zadat výsledek →</span>
        )}
      </div>
    </>
  );

  if (match.score) {
    return (
      <div className="rounded-lg border border-gray-800 bg-zinc-900 p-5 opacity-70">
        {content}
      </div>
    );
  }
  return (
    <Link
      href={scoreInputHref(tournamentId, match)}
      className="block rounded-lg border border-blue-500 bg-zinc-900 p-5 hover:bg-zinc-800 transition-colors"
    >
      {content}
    </Link>
  );
};

export const ScheduleMain = ({
  tournamentId,
  tournamentName,
  isOutdated,
  schedule,
  children,
}: Props) => {
  const [downloading, setDownloading] = useState<"pdf" | "slides" | null>(null);

  const rounds = new Map<number, ScheduledMatchWithResult[]>();
  for (const m of schedule) {
    rounds.set(m.round, [...(rounds.get(m.round) ?? []), m]);
  }
  const playedCount = schedule.filter((m) => m.score).length;
  // the active round is the first one with a match still to play
  const currentRound = schedule.find((m) => !m.score)?.round ?? null;
  const roundNumbers = Array.from(rounds.keys());
  const nextRound =
    currentRound === null
      ? null
      : (roundNumbers.find((r) => r > currentRound) ?? null);
  const usedTables = Math.max(1, ...schedule.map((m) => m.tableNumber));

  const handleDownload = async (kind: "pdf" | "slides") => {
    setDownloading(kind);
    try {
      const download =
        kind === "pdf" ? downloadSchedulePdf : downloadScheduleSlidesPdf;
      await download(tournamentName, schedule);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{tournamentName}</h1>
            <p className="text-gray-400 mt-2">
              Odehráno {playedCount} z {schedule.length} zápasů
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={`/${tournamentId}/stats`} className="btn btn-secondary">
              Statistiky turnaje
            </Link>
            <button
              className="btn btn-secondary"
              disabled={downloading !== null}
              onClick={() => handleDownload("pdf")}
            >
              {downloading === "pdf" ? "Připravuji PDF..." : "Stáhnout PDF"}
            </button>
            <button
              className="btn btn-secondary"
              disabled={downloading !== null}
              onClick={() => handleDownload("slides")}
            >
              {downloading === "slides"
                ? "Připravuji prezentaci..."
                : "Prezentace 16:9"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10">
        {isOutdated && (
          <div className="rounded-lg border border-yellow-600 bg-yellow-950 p-4 text-yellow-200">
            Rozpis neodpovídá aktuálním týmům v turnaji. Přegeneruj ho.
          </div>
        )}

        {currentRound === null ? (
          <div className="rounded-lg border border-green-600 bg-green-950 p-6 text-center">
            <h2 className="text-2xl font-bold text-green-300">
              Všechny zápasy odehrány
            </h2>
            <Link
              href={`/${tournamentId}/stats`}
              className="btn btn-primary mt-4"
            >
              Zobrazit výsledky
            </Link>
          </div>
        ) : (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Aktuální kolo {currentRound}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rounds.get(currentRound)!.map((m) => (
                <CurrentMatchCard
                  key={m.tableNumber}
                  tournamentId={tournamentId}
                  match={m}
                />
              ))}
            </div>
            {nextRound !== null && (
              <p className="mt-4 text-sm text-gray-400">
                <span className="font-semibold text-gray-300">
                  Další kolo {nextRound}:
                </span>{" "}
                {rounds
                  .get(nextRound)!
                  .map(
                    (m) =>
                      `Stůl ${m.tableNumber}: ${m.team1Name} vs ${m.team2Name}`
                  )
                  .join(" · ")}
              </p>
            )}
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4">Celý rozpis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from(rounds, ([round, matches]) => (
              <div
                key={round}
                className={`bg-zinc-900 rounded-lg border p-4 ${
                  round === currentRound
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-800"
                } ${matches.every((m) => m.score) ? "opacity-60" : ""}`}
              >
                <h3 className="text-lg font-semibold mb-3">
                  Kolo {round}
                  {round === currentRound && (
                    <span className="ml-2 text-sm font-normal text-blue-400">
                      právě se hraje
                    </span>
                  )}
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    {matches.map((m) => (
                      <tr
                        key={m.tableNumber}
                        className="border-t border-gray-800"
                      >
                        <td className="py-2 pr-2 text-gray-400 text-nowrap">
                          Stůl {m.tableNumber}
                        </td>
                        <td className="py-2 text-right">{m.team1Name}</td>
                        <td className="py-2 px-2 text-center text-nowrap">
                          {m.score ? (
                            <span className="text-green-500">{m.score}</span>
                          ) : (
                            <Link
                              href={scoreInputHref(tournamentId, m)}
                              className="text-blue-400 hover:underline"
                            >
                              zadat
                            </Link>
                          )}
                        </td>
                        <td className="py-2">{m.team2Name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        {children}

        <section className="border-t border-gray-800 pt-6">
          <h2 className="text-lg font-semibold mb-4">Nastavení rozpisu</h2>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <ScheduleGenerateForm
              tournamentId={tournamentId}
              defaultTables={usedTables}
              hasSchedule
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="btn btn-ghost">Upravit týmy</button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader className="bg-white">
                  <AlertDialogTitle className="text-black font-bold">
                    Zpět k nastavení turnaje?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Rozpis bude smazán, abys mohl upravit týmy. Odehrané zápasy
                    zůstanou zachovány. Po úpravě rozpis znovu vygeneruj.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="btn btn-secondary">
                    Zrušit
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteSchedule(tournamentId)}
                  >
                    Smazat rozpis
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </div>
  );
};
