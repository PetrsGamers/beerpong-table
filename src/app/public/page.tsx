import { getAllTournaments } from "@/actions/tournaments";
import { getCombinedExportData } from "@/actions/export";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function renderRank(idx: number) {
  if (idx === 0) {
    return (
      <span className="badge badge-warning font-black text-xs h-6 sm:h-7 px-2.5 shadow-sm inline-flex items-center justify-center tabular-nums">
        1.
      </span>
    );
  }
  if (idx === 1) {
    return (
      <span className="badge badge-ghost bg-slate-300 text-slate-900 border-slate-300 font-bold text-xs h-6 sm:h-7 px-2.5 shadow-sm inline-flex items-center justify-center tabular-nums">
        2.
      </span>
    );
  }
  if (idx === 2) {
    return (
      <span className="badge badge-ghost bg-amber-800 text-amber-100 border-amber-800 font-bold text-xs h-6 sm:h-7 px-2.5 shadow-sm inline-flex items-center justify-center tabular-nums">
        3.
      </span>
    );
  }
  return <span className="text-base-content/70 font-medium pl-1 sm:pl-2 tabular-nums">{idx + 1}.</span>;
}

function getRowStyle(idx: number) {
  if (idx === 0) return "bg-warning/15 font-bold hover:bg-warning/25 transition-colors";
  if (idx === 1) return "bg-base-200/80 font-semibold hover:bg-base-200 transition-colors";
  if (idx === 2) return "bg-base-200/50 font-medium hover:bg-base-200 transition-colors";
  return "hover:bg-base-200/40 transition-colors";
}

export default async function PublicOverviewPage() {
  const tournaments = await getAllTournaments();
  
  let combinedData = null;
  if (tournaments.length > 0) {
    const tournamentIds = tournaments.map((t: any) => t.id);
    combinedData = await getCombinedExportData(tournamentIds);
  }

  return (
    <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-10 md:p-12">
      <main className="mx-auto w-full max-w-[1280px] flex flex-col gap-6 sm:gap-10 md:gap-12 items-center">
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3 tracking-tight">
            SPPDF Beer Pong
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base md:text-lg">
            Oficiální výsledky všech turnajů
          </p>
        </div>

        {/* Turnaje List */}
        <section className="w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6">Turnaje</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 justify-items-stretch">
            {tournaments.map((t: any) => (
              <div key={t.id} className="card bg-base-100 w-full shadow-lg border border-base-200 hover:border-primary/50 transition-all">
                <div className="card-body p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-start gap-3">
                  <h3 className="card-title text-base sm:text-lg font-bold">{t.name}</h3>
                  <div className="card-actions justify-end">
                    <Link href={`/public/${t.id}`} className="btn btn-primary btn-sm sm:btn-md">
                      Zobrazit výsledky
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {tournaments.length === 0 && (
              <p className="text-base-content/60 italic py-4">Zatím nebyly vytvořeny žádné turnaje.</p>
            )}
          </div>
        </section>

        {/* Combined Stats */}
        {combinedData && combinedData.tournaments.length > 0 && (
          <section className="w-full mt-2 sm:mt-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6">Celkové Statistiky</h2>

            <div className="flex flex-col gap-4 sm:gap-8 w-full items-center">
              
              {/* Combined Teams */}
              <div className="card bg-base-100 w-full shadow-lg border border-base-200">
                <div className="card-body p-3 sm:p-6">
                  <h3 className="card-title text-base sm:text-xl justify-center mb-3">Celkové Týmové Pořadí</h3>
                  <div className="overflow-x-auto w-full">
                    <table className="table table-sm sm:table-md w-full">
                      <thead>
                        <tr>
                          <th className="w-14 sm:w-20 px-2 sm:px-3 text-center sm:text-left">Poř.</th>
                          <th className="px-2 sm:px-3">Tým</th>
                          {combinedData.tournaments.map((t: any) => (
                            <th key={t.id} className="text-center px-1.5 sm:px-3 text-xs sm:text-sm whitespace-nowrap" title={t.name}>
                              {t.shortLabel || t.name.substring(0, 5)}
                            </th>
                          ))}
                          <th className="text-right px-2 sm:px-3">Celkem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const sortedTeams = [...combinedData.teamRows].sort((a, b) => {
                            const totalA = a.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                            const totalB = b.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                            return totalB - totalA;
                          });
                          
                          return sortedTeams.slice(0, 20).map((row: any, idx: number) => {
                            const total = row.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                            return (
                              <tr key={row.name} className={getRowStyle(idx)}>
                                <td className="w-14 sm:w-20 px-2 sm:px-3">{renderRank(idx)}</td>
                                <td className="px-2 sm:px-3 font-semibold sm:font-normal whitespace-nowrap sm:whitespace-normal">{row.name}</td>
                                {row.values.map((val: number, vIdx: number) => (
                                  <td key={vIdx} className="text-center px-1.5 sm:px-3 text-base-content/70 tabular-nums">
                                    {val || '-'}
                                  </td>
                                ))}
                                <td className="text-right px-2 sm:px-3 font-bold tabular-nums">{total}</td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 justify-center items-start">
                {/* Combined Players - Score */}
                <div className="card bg-base-100 w-full xl:max-w-xl shadow-lg border border-base-200">
                  <div className="card-body p-3 sm:p-6">
                    <h3 className="card-title text-base sm:text-xl justify-center mb-3">Historicky Král střelců</h3>
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
                          {(() => {
                            const sortedScore = [...combinedData.playerScoreRows].sort((a, b) => {
                              const totalA = a.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                              const totalB = b.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                              return totalB - totalA;
                            });
                            
                            return sortedScore.slice(0, 10).map((row: any, idx: number) => {
                              const total = row.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                              return (
                                <tr key={row.name} className={getRowStyle(idx)}>
                                  <td className="w-14 sm:w-20 px-2 sm:px-3">{renderRank(idx)}</td>
                                  <td className="px-2 sm:px-3 font-semibold sm:font-normal">{row.name}</td>
                                  <td className="text-right px-2 sm:px-3 font-bold tabular-nums">{total}</td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Combined Players - BJ */}
                <div className="card bg-base-100 w-full xl:max-w-xl shadow-lg border border-base-200">
                  <div className="card-body p-3 sm:p-6">
                    <h3 className="card-title text-base sm:text-xl justify-center mb-3">Historicky BlowJob King</h3>
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
                          {(() => {
                            const sortedBJ = [...combinedData.playerBjRows].sort((a, b) => {
                              const totalA = a.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                              const totalB = b.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                              return totalB - totalA;
                            });
                            
                            return sortedBJ.slice(0, 10).map((row: any, idx: number) => {
                              const total = row.values.reduce((sum: number, val: number) => sum + (val || 0), 0);
                              return (
                                <tr key={row.name} className={getRowStyle(idx)}>
                                  <td className="w-14 sm:w-20 px-2 sm:px-3">{renderRank(idx)}</td>
                                  <td className="px-2 sm:px-3 font-semibold sm:font-normal">{row.name}</td>
                                  <td className="text-right px-2 sm:px-3 font-bold tabular-nums">{total}</td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}
      </main>
    </div>
  );
}
