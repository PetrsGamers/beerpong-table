import { getSeasonById, setActiveSeason } from "@/actions/seasons";
import { getRoundsForSeason, createRound } from "@/actions/rounds";
import { getTeamsForSeason, createTeam, deleteTeam } from "@/actions/teams";
import {
  getPlayersForSeason,
  createPlayer,
  deletePlayer,
} from "@/actions/players";
import {
  getSeasonPlayerLeaderboard,
  getSeasonTeamStandings,
} from "@/actions/stats";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SeasonDetailPage({
  params,
}: {
  params: { seasonId: string };
}) {
  const seasonId = Number(params.seasonId);
  if (isNaN(seasonId)) return notFound();

  const currentSeason = await getSeasonById(seasonId);
  if (!currentSeason) return notFound();

  const [rounds, teams, players, playerStats, teamStandings] =
    await Promise.all([
      getRoundsForSeason(seasonId),
      getTeamsForSeason(seasonId),
      getPlayersForSeason(seasonId),
      getSeasonPlayerLeaderboard(seasonId),
      getSeasonTeamStandings(seasonId),
    ]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-6">
        <div>
          <div className="text-sm breadcrumbs mb-1">
            <ul>
              <li>
                <Link href="/">Domů</Link>
              </li>
              <li>
                <Link href="/seasons">Semestry</Link>
              </li>
              <li className="font-semibold">{currentSeason.name}</li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black">
              {currentSeason.name}
            </h1>
            <span
              className={`badge ${
                currentSeason.isActive ? "badge-success" : "badge-ghost"
              } font-semibold`}
            >
              {currentSeason.isActive ? "● Aktivní semestr" : "📁 Archiv"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!currentSeason.isActive && (
            <form
              action={async () => {
                "use server";
                await setActiveSeason(seasonId);
              }}
            >
              <button
                type="submit"
                className="btn btn-outline btn-success btn-sm"
              >
                Nastavit jako aktivní semestr
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card bg-base-200 border border-base-300 shadow-sm">
          <div className="card-body p-6">
            <h2 className="card-title text-base-content/70 text-sm">
              Turnajové večery (Kola)
            </h2>
            <p className="text-4xl font-extrabold">{rounds.length}</p>
          </div>
        </div>
        <div className="card bg-base-200 border border-base-300 shadow-sm">
          <div className="card-body p-6">
            <h2 className="card-title text-base-content/70 text-sm">
              Týmy v semestru
            </h2>
            <p className="text-4xl font-extrabold">{teams.length}</p>
          </div>
        </div>
        <div className="card bg-base-200 border border-base-300 shadow-sm">
          <div className="card-body p-6">
            <h2 className="card-title text-base-content/70 text-sm">
              Registrovaní hráči
            </h2>
            <p className="text-4xl font-extrabold">{players.length}</p>
          </div>
        </div>
      </div>

      {/* Turnajové večery (Kola) v této sezóně */}
      <section className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="card-title text-2xl font-bold">
                📅 Kola semestru ({rounds.length})
              </h2>
              <p className="text-sm text-base-content/70">
                Jednotlivé večery, kdy se hrají zápasy
              </p>
            </div>

            {/* Formulář pro přidání kola */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (name?.trim()) {
                  await createRound({
                    name: name.trim(),
                    seasonId,
                    roundNumber: rounds.length + 1,
                  });
                }
              }}
              className="flex gap-2"
            >
              <input
                name="name"
                placeholder={`Název ${rounds.length + 1}. kola`}
                className="input input-bordered input-sm"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                + Přidat kolo
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
            {rounds.map((r) => (
              <Link
                key={r.id}
                href={`/rounds/${r.id}`}
                className={`card border p-4 transition-all hover:scale-[1.02] hover:shadow-md ${
                  r.isCompleted
                    ? "bg-base-100 border-base-300"
                    : "bg-base-200/50 border-base-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase text-base-content/60">
                    {r.roundNumber}. KOLO
                  </span>
                  <span
                    className={`badge badge-xs ${
                      r.isCompleted ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {r.isCompleted ? "Odehráno" : "Čeká"}
                  </span>
                </div>
                <h3 className="font-bold text-lg mt-1">{r.name}</h3>
                {r.date && (
                  <p className="text-xs text-base-content/60 mt-1">
                    📅 {new Date(r.date).toLocaleDateString("cs-CZ")}
                  </p>
                )}
                <span className="btn btn-ghost btn-xs self-end mt-4">
                  Otevřít →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Celková ligová tabulka týmů v sezóně */}
      <section className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <h2 className="card-title text-xl font-bold flex items-center gap-2 mb-2">
            🏆 Celková ligová tabulka semestru
          </h2>
          {teamStandings.length === 0 ? (
            <p className="text-base-content/60 italic py-6 text-center">
              Zatím žádné odehrané zápasy v této sezóně.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="w-16">Poř.</th>
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
                  {teamStandings.map((t, i) => (
                    <tr
                      key={t.teamId}
                      className={i === 0 ? "bg-warning/15 font-bold" : ""}
                    >
                      <td>{i + 1}.</td>
                      <td className="font-semibold text-base">{t.teamName}</td>
                      <td className="text-center">{t.played}</td>
                      <td className="text-center text-success">{t.wins}</td>
                      <td className="text-center text-base-content/60">
                        {t.draws}
                      </td>
                      <td className="text-center text-error">{t.losses}</td>
                      <td className="text-center font-mono">
                        {t.cupsScored}:{t.cupsConceded}
                      </td>
                      <td className="text-center font-mono text-sm">
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

      {/* Žebříčky hráčů za sezónu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Král střelců */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold mb-4">
              🎯 Král střelců sezóny
            </h2>
            {playerStats.length === 0 ? (
              <p className="text-base-content/60 italic">Žádné statistiky.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr>
                      <th className="w-12">Poř.</th>
                      <th>Hráč</th>
                      <th className="text-center">Zápasy</th>
                      <th className="text-right">Kelímky (Góly)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((p, i) => (
                      <tr
                        key={p.playerId}
                        className={i === 0 ? "bg-warning/15 font-bold" : ""}
                      >
                        <td>{i + 1}.</td>
                        <td>{p.playerName}</td>
                        <td className="text-center">{p.matchesPlayed}</td>
                        <td className="text-right font-bold text-primary">
                          {p.totalScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* BlowJob King */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold mb-4">
              💨 BlowJob King sezóny
            </h2>
            {playerStats.length === 0 ? (
              <p className="text-base-content/60 italic">Žádné statistiky.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr>
                      <th className="w-12">Poř.</th>
                      <th>Hráč</th>
                      <th className="text-center">Zápasy</th>
                      <th className="text-right">Vyfouknutí (BJ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...playerStats]
                      .sort((a, b) => b.totalBlowjobs - a.totalBlowjobs)
                      .map((p, i) => (
                        <tr
                          key={p.playerId}
                          className={i === 0 ? "bg-info/15 font-bold" : ""}
                        >
                          <td>{i + 1}.</td>
                          <td>{p.playerName}</td>
                          <td className="text-center">{p.matchesPlayed}</td>
                          <td className="text-right font-bold text-info">
                            {p.totalBlowjobs}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Správa Týmů a Hráčů v sezóně */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Správa týmů */}
        <section className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl font-bold">
                🛡️ Týmy v semestru
              </h2>
              <span className="badge badge-neutral">{teams.length}</span>
            </div>

            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (name?.trim()) {
                  await createTeam({ name: name.trim(), seasonId });
                }
              }}
              className="flex gap-2 mb-4"
            >
              <input
                name="name"
                placeholder="Název nového týmu"
                className="input input-bordered input-sm flex-1"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                + Přidat tým
              </button>
            </form>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-base-200"
                >
                  <span className="font-semibold">{t.name}</span>
                  <form
                    action={async () => {
                      "use server";
                      await deleteTeam(t.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-ghost btn-xs text-error"
                    >
                      Smazat
                    </button>
                  </form>
                </div>
              ))}
              {teams.length === 0 && (
                <p className="text-base-content/60 italic text-sm py-4 text-center">
                  Zatím žádné týmy.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Správa hráčů */}
        <section className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl font-bold">
                👤 Registrovaní hráči
              </h2>
              <span className="badge badge-neutral">{players.length}</span>
            </div>

            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (name?.trim()) {
                  await createPlayer({ name: name.trim(), seasonId });
                }
              }}
              className="flex gap-2 mb-4"
            >
              <input
                name="name"
                placeholder="Jméno a příjmení hráče"
                className="input input-bordered input-sm flex-1"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                + Registrovat hráče
              </button>
            </form>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-base-200"
                >
                  <span className="font-semibold">{p.name}</span>
                  <form
                    action={async () => {
                      "use server";
                      await deletePlayer(p.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-ghost btn-xs text-error"
                    >
                      Smazat
                    </button>
                  </form>
                </div>
              ))}
              {players.length === 0 && (
                <p className="text-base-content/60 italic text-sm py-4 text-center">
                  Zatím žádní hráči.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
