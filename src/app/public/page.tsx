import { getAllTournaments } from "@/actions/tournaments";
import { getCombinedExportData } from "@/actions/export";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PublicOverviewPage() {
  const tournaments = await getAllTournaments();
  
  let combinedData = null;
  if (tournaments.length > 0) {
    const tournamentIds = tournaments.map((t: any) => t.id);
    combinedData = await getCombinedExportData(tournamentIds);
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-12">
      <main className="mx-auto w-full max-w-[1280px] flex flex-col gap-12 items-center">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            SPPDF Beer Pong
          </h1>
          <p className="text-base-content/70 text-lg">
            Oficiální výsledky všech turnajů
          </p>
        </div>

        {/* Turnaje List */}
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-6">Turnaje</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
            {tournaments.map((t: any) => (
              <div key={t.id} className="card bg-base-100 w-full max-w-sm shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">{t.name}</h3>
                  <div className="card-actions justify-end mt-4">
                    <Link href={`/public/${t.id}`} className="btn btn-primary">
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
          <section className="w-full mt-8">
            <h2 className="text-2xl font-bold mb-6">Celkové Statistiky</h2>

            <div className="flex flex-col gap-8 w-full items-center">
              
              {/* Combined Teams */}
              <div className="card bg-base-100 w-full shadow-xl">
                <div className="card-body overflow-x-auto">
                  <h3 className="card-title justify-center mb-4">Celkové Týmové Pořadí</h3>
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Poř.</th>
                        <th>Tým</th>
                        {combinedData.tournaments.map((t: any) => (
                          <th key={t.id} className="text-center" title={t.name}>
                            {t.shortLabel || t.name.substring(0, 5)}
                          </th>
                        ))}
                        <th className="text-right">Celkem</th>
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
                            <tr key={row.name} className={idx < 3 ? "font-bold bg-base-200" : ""}>
                              <td>{idx + 1}.</td>
                              <td>{row.name}</td>
                              {row.values.map((val: number, vIdx: number) => (
                                <td key={vIdx} className="text-center text-base-content/70">
                                  {val || '-'}
                                </td>
                              ))}
                              <td className="text-right font-bold">{total}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full flex flex-col xl:flex-row gap-8 justify-center items-start">
                {/* Combined Players - Score */}
                <div className="card bg-base-100 w-full max-w-xl shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title justify-center mb-4">Historicky Král střelců</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Pořadí</th>
                            <th>Hráč</th>
                            <th className="text-right">Skóre</th>
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
                                <tr key={row.name} className={idx === 0 ? "font-bold bg-base-200" : ""}>
                                  <td>{idx + 1}.</td>
                                  <td>{row.name}</td>
                                  <td className="text-right">{total}</td>
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
                <div className="card bg-base-100 w-full max-w-xl shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title justify-center mb-4">Historicky BlowJob King</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Pořadí</th>
                            <th>Hráč</th>
                            <th className="text-right">Počet</th>
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
                                <tr key={row.name} className={idx === 0 ? "font-bold bg-base-200" : ""}>
                                  <td>{idx + 1}.</td>
                                  <td>{row.name}</td>
                                  <td className="text-right">{total}</td>
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
