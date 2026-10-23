import { getActiveSeason } from "@/actions/seasons";
import { getRoundsForSeason } from "@/actions/rounds";
import {
  getSeasonPlayerLeaderboard,
  getSeasonTeamStandings,
} from "@/actions/stats";
import Link from "next/link";

export default async function HomePage() {
  const activeSeason = await getActiveSeason();

  if (!activeSeason) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4">🦊 SPPDF BeerPong Liga</h1>
        <p className="text-base-content/70 text-lg mb-8">
          V systému zatím není nastavena žádná aktivní sezóna semestru.
        </p>
        <Link href="/seasons" className="btn btn-primary">
          Přejít do správy semestrů →
        </Link>
      </div>
    );
  }

  const [rounds, teamStandings, playerLeaderboard] = await Promise.all([
    getRoundsForSeason(activeSeason.id),
    getSeasonTeamStandings(activeSeason.id),
    getSeasonPlayerLeaderboard(activeSeason.id),
  ]);

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Hero sekce aktivní sezóny */}
      <div className="hero bg-base-200 rounded-3xl p-6 sm:p-10 border border-base-300">
        <div className="hero-content flex-col lg:flex-row justify-between w-full gap-8">
          <div className="text-left max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-success gap-1 font-semibold">
                ● Aktivní semestr
              </span>
              <span className="text-xs text-base-content/60">
                5 turnajových večerů
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              {activeSeason.name}
            </h1>
            <p className="py-3 text-base-content/80 text-base sm:text-lg">
              Oficiální systém BeerPong ligy. Přehled turnajových večerů (kol),
              aktuální ligová tabulka týmů a statistiky střelců za semestr.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href={`/seasons/${activeSeason.id}`}
                className="btn btn-primary btn-sm sm:btn-md"
              >
                ⚙️ Správa týmů a hráčů
              </Link>
              <Link
                href="/seasons"
                className="btn btn-outline btn-sm sm:btn-md"
              >
                📁 Archiv minulých semestrů
              </Link>
            </div>
          </div>

          {/* Rychlý box králů semestru */}
          <div className="card bg-base-100 shadow-md border border-base-300 w-full lg:w-80">
            <div className="card-body p-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/60 mb-2">
                👑 Králové semestru
              </h3>
              {playerLeaderboard.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-warning/10 border border-warning/20">
                    <div>
                      <div className="text-xs text-warning-content font-bold">
                        KRÁL STŘELCŮ
                      </div>
                      <div className="font-extrabold text-base">
                        {playerLeaderboard[0]?.playerName}
                      </div>
                    </div>
                    <div className="text-xl font-black text-warning">
                      {playerLeaderboard[0]?.totalScore} 🎯
                    </div>
                  </div>

                  {/* Blowjob King */}
                  {(() => {
                    const bjKing = [...playerLeaderboard].sort(
                      (a, b) => b.totalBlowjobs - a.totalBlowjobs
                    )[0];
                    return (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-info/10 border border-info/20">
                        <div>
                          <div className="text-xs text-info-content font-bold">
                            BLOWJOB KING
                          </div>
                          <div className="font-extrabold text-base">
                            {bjKing?.playerName}
                          </div>
                        </div>
                        <div className="text-xl font-black text-info">
                          {bjKing?.totalBlowjobs} 🌬️
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-sm text-base-content/60 italic">
                  Zatím žádné odehrané zápasy.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Přehled 5 kol (Turnajových večerů) */}
      <section id="kola" className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Turnajové večery (Kola)
            </h2>
            <p className="text-base-content/70 text-sm">
              Semestr typicky obsahuje 5 kol zakončených Velkým Finále
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {rounds.map((r) => {
            const isFinal = r.roundNumber === 5;
            return (
              <Link
                key={r.id}
                href={`/rounds/${r.id}`}
                className={`card border transition-all hover:scale-[1.02] hover:shadow-lg ${
                  r.isCompleted
                    ? "bg-base-100 border-base-300"
                    : isFinal
                    ? "bg-warning/10 border-warning/40 shadow-sm"
                    : "bg-base-200/60 border-base-300"
                }`}
              >
                <div className="card-body p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                      {isFinal ? "FINÁLE" : `${r.roundNumber}. KOLO`}
                    </span>
                    {r.isCompleted ? (
                      <span className="badge badge-success badge-sm">
                        Odehráno
                      </span>
                    ) : (
                      <span className="badge badge-ghost badge-sm">
                        Nadcházející
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mt-1 mb-2">{r.name}</h3>
                  {r.date && (
                    <p className="text-xs text-base-content/60">
                      📅 {new Date(r.date).toLocaleDateString("cs-CZ")}
                    </p>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <span className="btn btn-ghost btn-xs">Detail kola →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Celková ligová tabulka & Žebříček střelců */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Celková ligová tabulka týmů */}
        <section className="card bg-base-100 shadow-xl border border-base-300 lg:col-span-2">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold flex items-center gap-2 mb-2">
              🏆 Celková ligová tabulka ({activeSeason.name})
            </h2>
            <p className="text-sm text-base-content/70 mb-4">
              Sčítá body a skóre týmů za všech 5 odehraných večerů semestru.
            </p>

            {teamStandings.length === 0 ? (
              <p className="text-base-content/60 italic py-6 text-center">
                V tomto semestru zatím nebyly zapsány žádné výsledky.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="w-12">Poř.</th>
                      <th>Tým</th>
                      <th className="text-center">Zápasy</th>
                      <th className="text-center">V</th>
                      <th className="text-center">R</th>
                      <th className="text-center">P</th>
                      <th className="text-center">Skóre</th>
                      <th className="text-center">+/-</th>
                      <th className="text-right">Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map((t, idx) => (
                      <tr
                        key={t.teamId}
                        className={
                          idx === 0
                            ? "bg-warning/15 font-bold"
                            : idx < 3
                            ? "font-semibold"
                            : ""
                        }
                      >
                        <td>
                          {idx === 0
                            ? "🥇"
                            : idx === 1
                            ? "🥈"
                            : idx === 2
                            ? "🥉"
                            : `${idx + 1}.`}
                        </td>
                        <td className="font-medium text-base">{t.teamName}</td>
                        <td className="text-center">{t.played}</td>
                        <td className="text-center text-success">{t.wins}</td>
                        <td className="text-center text-base-content/60">
                          {t.draws}
                        </td>
                        <td className="text-center text-error">{t.losses}</td>
                        <td className="text-center font-mono">
                          {t.cupsScored}:{t.cupsConceded}
                        </td>
                        <td
                          className={`text-center font-mono text-sm ${
                            t.cupDiff > 0
                              ? "text-success"
                              : t.cupDiff < 0
                              ? "text-error"
                              : ""
                          }`}
                        >
                          {t.cupDiff > 0 ? `+${t.cupDiff}` : t.cupDiff}
                        </td>
                        <td className="text-right font-black text-lg text-primary">
                          {t.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Žebříček střelců za semestr */}
        <section className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold flex items-center gap-2 mb-2">
              🎯 Král střelců semestru
            </h2>
            <p className="text-sm text-base-content/70 mb-4">
              Individuální žebříček hráčů (hráč sbírá body i při změně týmu)
            </p>

            {playerLeaderboard.length === 0 ? (
              <p className="text-base-content/60 italic py-6 text-center">
                Žádná individuální data.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr>
                      <th className="w-8">#</th>
                      <th>Hráč</th>
                      <th className="text-center">🎯 Kelímky</th>
                      <th className="text-center">🌬️ BJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerLeaderboard.slice(0, 10).map((p, idx) => (
                      <tr
                        key={p.playerId}
                        className={idx === 0 ? "bg-warning/15 font-bold" : ""}
                      >
                        <td>{idx + 1}.</td>
                        <td className="font-semibold">{p.playerName}</td>
                        <td className="text-center font-bold font-mono text-base text-primary">
                          {p.totalScore}
                        </td>
                        <td className="text-center font-mono text-info">
                          {p.totalBlowjobs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
