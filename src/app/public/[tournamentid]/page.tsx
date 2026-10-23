import { getTournamentById } from "@/actions/tournaments";
import { getTeamsForTournamentSorted } from "@/actions/teams";
import { getPlayersForTournamentId } from "@/actions/players";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function renderRank(idx: number) {
  if (idx === 0) {
    return (
      <span className="badge badge-warning gap-1 font-bold text-xs h-6 sm:h-7 px-2 sm:px-2.5 shadow-sm inline-flex items-center justify-center whitespace-nowrap">
        <span>🥇</span>
        <span>1.</span>
      </span>
    );
  }
  if (idx === 1) {
    return (
      <span className="badge badge-ghost bg-slate-300 text-slate-900 border-slate-300 gap-1 font-bold text-xs h-6 sm:h-7 px-2 sm:px-2.5 shadow-sm inline-flex items-center justify-center whitespace-nowrap">
        <span>🥈</span>
        <span>2.</span>
      </span>
    );
  }
  if (idx === 2) {
    return (
      <span className="badge badge-ghost bg-amber-800 text-amber-100 border-amber-800 gap-1 font-bold text-xs h-6 sm:h-7 px-2 sm:px-2.5 shadow-sm inline-flex items-center justify-center whitespace-nowrap">
        <span>🥉</span>
        <span>3.</span>
      </span>
    );
  }
  return <span className="text-base-content/70 font-medium pl-1 sm:pl-2">{idx + 1}.</span>;
}

function getRowStyle(idx: number) {
  if (idx === 0) return "bg-warning/15 font-bold hover:bg-warning/25 transition-colors";
  if (idx === 1) return "bg-base-200/80 font-semibold hover:bg-base-200 transition-colors";
  if (idx === 2) return "bg-base-200/50 font-medium hover:bg-base-200 transition-colors";
  return "hover:bg-base-200/40 transition-colors";
}

export default async function PublicTournamentPage({
  params,
}: {
  params: { tournamentid: string };
}) {
  const tournamentId = parseInt(params.tournamentid);
  if (isNaN(tournamentId)) return notFound();
  
  const tournament = await getTournamentById(tournamentId);
  if (!tournament) return notFound();
  
  const [teamsOrdered, allPlayers] = await Promise.all([
    getTeamsForTournamentSorted(tournamentId),
    getPlayersForTournamentId(tournamentId),
  ]);
  
  const players = allPlayers.filter((p): p is NonNullable<typeof p> => Boolean(p));
  const playersByScore = [...players].sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0));
  const playersByBJ = [...players].sort((a, b) => Number(b.blowjobs ?? 0) - Number(a.blowjobs ?? 0));

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 sm:py-8 md:p-10">
      <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between mb-3 sm:mb-6">
        <Link
          href="/public"
          className="btn btn-ghost btn-sm sm:btn-md gap-1.5 px-2 sm:px-4 text-base-content/80 hover:text-base-content"
        >
          <span className="text-base">←</span>
          <span className="text-xs sm:text-sm font-semibold">Zpět na přehled</span>
        </Link>
        <span className="badge badge-neutral text-xs px-2.5 py-1">Veřejné výsledky</span>
      </div>

      <main className="mx-auto w-full max-w-[1280px] flex flex-col gap-4 sm:gap-6 md:gap-8 items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-center tracking-tight mb-1 sm:mb-4">
          {tournament.name}
        </h1>

        <div className="w-full flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 justify-center items-start">
          
          {/* Týmové pořadí */}
          <div className="card bg-base-100 w-full xl:max-w-xl shadow-xl border border-base-200">
            <div className="card-body p-3.5 sm:p-6">
              <h2 className="card-title text-base sm:text-xl font-bold justify-center mb-2 sm:mb-4">Celkové skóre</h2>
              {teamsOrdered.length === 0 ? (
                <p className="text-center text-base-content/60 py-4">Zatím žádné výsledky</p>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="table table-sm sm:table-md w-full">
                    <thead>
                      <tr>
                        <th className="w-14 sm:w-20 px-2 sm:px-3 text-center sm:text-left">Pořadí</th>
                        <th className="px-2 sm:px-3">Tým</th>
                        <th className="text-right px-2 sm:px-3">Skóre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamsOrdered.map((team, idx) => (
                        <tr key={team.id} className={getRowStyle(idx)}>
                          <td className="w-14 sm:w-20 px-2 sm:px-3">{renderRank(idx)}</td>
                          <td className="px-2 sm:px-3 font-semibold sm:font-normal">{team.name}</td>
                          <td className="text-right px-2 sm:px-3 font-bold tabular-nums">{team.score || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 w-full xl:max-w-xl">
            {/* Král střelců */}
            <div className="card bg-base-100 w-full shadow-xl border border-base-200">
              <div className="card-body p-3.5 sm:p-6">
                <h2 className="card-title text-base sm:text-xl font-bold justify-center mb-2 sm:mb-4">Král střelců</h2>
                {playersByScore.length === 0 ? (
                  <p className="text-center text-base-content/60 py-4">Zatím žádné výsledky</p>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="table table-sm sm:table-md w-full">
                      <thead>
                        <tr>
                          <th className="w-14 sm:w-20 px-2 sm:px-3 text-center sm:text-left">Pořadí</th>
                          <th className="px-2 sm:px-3">Hráč</th>
                          <th className="text-right px-2 sm:px-3">Skóre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playersByScore.slice(0, 10).map((player, idx) => (
                          <tr key={player.id} className={getRowStyle(idx)}>
                            <td className="w-14 sm:w-20 px-2 sm:px-3">{renderRank(idx)}</td>
                            <td className="px-2 sm:px-3 font-semibold sm:font-normal">{player.name}</td>
                            <td className="text-right px-2 sm:px-3 font-bold tabular-nums">{player.score || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* BlowJob King */}
            <div className="card bg-base-100 w-full shadow-xl border border-base-200">
              <div className="card-body p-3.5 sm:p-6">
                <h2 className="card-title text-base sm:text-xl font-bold justify-center mb-2 sm:mb-4">BlowJob King</h2>
                {playersByBJ.length === 0 ? (
                  <p className="text-center text-base-content/60 py-4">Zatím žádné výsledky</p>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="table table-sm sm:table-md w-full">
                      <thead>
                        <tr>
                          <th className="w-14 sm:w-20 px-2 sm:px-3 text-center sm:text-left">Pořadí</th>
                          <th className="px-2 sm:px-3">Hráč</th>
                          <th className="text-right px-2 sm:px-3">Počet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playersByBJ.slice(0, 10).map((player, idx) => (
                          <tr key={player.id} className={getRowStyle(idx)}>
                            <td className="w-14 sm:w-20 px-2 sm:px-3">{renderRank(idx)}</td>
                            <td className="px-2 sm:px-3 font-semibold sm:font-normal">{player.name}</td>
                            <td className="text-right px-2 sm:px-3 font-bold tabular-nums">{player.blowjobs || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
