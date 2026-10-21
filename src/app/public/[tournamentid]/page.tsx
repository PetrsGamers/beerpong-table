import { getTournamentById } from "@/actions/tournaments";
import { getTeamsForTournamentSorted } from "@/actions/teams";
import { getPlayersForTournamentId } from "@/actions/players";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function renderRank(idx: number) {
  if (idx === 0) {
    return (
      <span className="badge badge-warning gap-1 font-bold text-xs py-2.5 px-2.5 shadow-sm">
        🥇 1.
      </span>
    );
  }
  if (idx === 1) {
    return (
      <span className="badge badge-ghost bg-slate-300 text-slate-900 border-slate-300 gap-1 font-bold text-xs py-2.5 px-2.5 shadow-sm">
        🥈 2.
      </span>
    );
  }
  if (idx === 2) {
    return (
      <span className="badge badge-ghost bg-amber-800 text-amber-100 border-amber-800 gap-1 font-bold text-xs py-2.5 px-2.5 shadow-sm">
        🥉 3.
      </span>
    );
  }
  return <span className="text-base-content/70 font-medium pl-1.5">{idx + 1}.</span>;
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
    <div className="min-h-screen p-8 pb-20 sm:p-12 relative">
      <div className="absolute top-8 left-8">
        <Link href="/public" className="btn btn-ghost">
          ← Zpět na přehled
        </Link>
      </div>

      <main className="mx-auto w-full max-w-[1280px] flex flex-col gap-8 items-center mt-12 sm:mt-0">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {tournament.name}
        </h1>

        <div className="w-full flex flex-col xl:flex-row gap-8 justify-center items-start">
          
          {/* Týmové pořadí */}
          <div className="card bg-base-100 w-full max-w-lg shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center mb-4">Celkové skóre</h2>
              {teamsOrdered.length === 0 ? (
                <p className="text-center text-base-content/60">Zatím žádné výsledky</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="w-20">Pořadí</th>
                        <th>Tým</th>
                        <th className="text-right">Skóre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamsOrdered.map((team, idx) => (
                        <tr key={team.id} className={getRowStyle(idx)}>
                          <td className="w-20">{renderRank(idx)}</td>
                          <td>{team.name}</td>
                          <td className="text-right">{team.score || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8 w-full max-w-lg">
            {/* Král střelců */}
            <div className="card bg-base-100 w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title justify-center mb-4">Král střelců</h2>
                {playersByScore.length === 0 ? (
                  <p className="text-center text-base-content/60">Zatím žádné výsledky</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th className="w-20">Pořadí</th>
                          <th>Hráč</th>
                          <th className="text-right">Skóre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playersByScore.slice(0, 10).map((player, idx) => (
                          <tr key={player.id} className={getRowStyle(idx)}>
                            <td className="w-20">{renderRank(idx)}</td>
                            <td>{player.name}</td>
                            <td className="text-right">{player.score || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* BlowJob King */}
            <div className="card bg-base-100 w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title justify-center mb-4">BlowJob King</h2>
                {playersByBJ.length === 0 ? (
                  <p className="text-center text-base-content/60">Zatím žádné výsledky</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th className="w-20">Pořadí</th>
                          <th>Hráč</th>
                          <th className="text-right">Počet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playersByBJ.slice(0, 10).map((player, idx) => (
                          <tr key={player.id} className={getRowStyle(idx)}>
                            <td className="w-20">{renderRank(idx)}</td>
                            <td>{player.name}</td>
                            <td className="text-right">{player.blowjobs || 0}</td>
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
