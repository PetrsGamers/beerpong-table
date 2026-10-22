import { getSeasonById } from "@/actions/seasons";
import { getTournamentsForSeason } from "@/actions/tournaments";
import { getTeamsForSeason, createTeam, deleteTeam } from "@/actions/teams";
import { getPlayersForSeason, createPlayer, deletePlayer } from "@/actions/players";
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

  const [tournaments, teams, players, playerStats, teamStandings] =
    await Promise.all([
      getTournamentsForSeason(seasonId),
      getTeamsForSeason(seasonId),
      getPlayersForSeason(seasonId),
      getSeasonPlayerLeaderboard(seasonId),
      getSeasonTeamStandings(seasonId),
    ]);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-6">
        <div>
          <div className="text-sm breadcrumbs mb-1">
            <ul>
              <li>
                <Link href="/seasons">Sezóny</Link>
              </li>
              <li>{currentSeason.name}</li>
            </ul>
          </div>
          <h1 className="text-3xl font-extrabold">{currentSeason.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/seasons/${seasonId}/tournaments`}
            className="btn btn-primary"
          >
            Spravovat turnaje ({tournaments.length})
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base-content/70 text-sm">Turnaje</h2>
            <p className="text-4xl font-bold">{tournaments.length}</p>
          </div>
        </div>
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base-content/70 text-sm">
              Týmy v sezóně
            </h2>
            <p className="text-4xl font-bold">{teams.length}</p>
          </div>
        </div>
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base-content/70 text-sm">
              Registrovaní hráči
            </h2>
            <p className="text-4xl font-bold">{players.length}</p>
          </div>
        </div>
      </div>

      {/* Celková tabulka týmů v sezóně */}
      <section className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">
            🏆 Celková tabulka týmů v sezóně
          </h2>
          {teamStandings.length === 0 ? (
            <p className="text-base-content/60 italic">Zatím žádné odehrané zápasy v této sezóně.</p>
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
                    <th className="text-right">Body</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStandings.map((t, i) => (
                    <tr key={t.teamId} className={i === 0 ? "bg-warning/10 font-bold" : ""}>
                      <td>{i + 1}.</td>
                      <td>{t.teamName}</td>
                      <td className="text-center">{t.played}</td>
                      <td className="text-center">{t.wins}</td>
                      <td className="text-center">{t.draws}</td>
                      <td className="text-center">{t.losses}</td>
                      <td className="text-center">
                        {t.cupsScored}:{t.cupsConceded} ({t.cupDiff >= 0 ? `+${t.cupDiff}` : t.cupDiff})
                      </td>
                      <td className="text-right font-bold text-lg">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Král střelců a BlowJob King sezóny */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Král střelců */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">🎯 Král střelců sezóny</h2>
            {playerStats.length === 0 ? (
              <p className="text-base-content/60 italic">Žádné statistiky hráčů.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="w-16">Poř.</th>
                      <th>Hráč</th>
                      <th className="text-center">Zápasy</th>
                      <th className="text-right">Trefené kelímky</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.slice(0, 10).map((p, i) => (
                      <tr key={p.playerId} className={i === 0 ? "bg-warning/10 font-bold" : ""}>
                        <td>{i + 1}.</td>
                        <td>{p.playerName}</td>
                        <td className="text-center">{p.matchesPlayed}</td>
                        <td className="text-right font-bold">{p.totalScore}</td>
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
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">💨 BlowJob King sezóny</h2>
            {playerStats.length === 0 ? (
              <p className="text-base-content/60 italic">Žádné statistiky hráčů.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="w-16">Poř.</th>
                      <th>Hráč</th>
                      <th className="text-center">Zápasy</th>
                      <th className="text-right">Vyfouknutí (BJ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...playerStats]
                      .sort((a, b) => b.totalBlowjobs - a.totalBlowjobs)
                      .slice(0, 10)
                      .map((p, i) => (
                        <tr key={p.playerId} className={i === 0 ? "bg-warning/10 font-bold" : ""}>
                          <td>{i + 1}.</td>
                          <td>{p.playerName}</td>
                          <td className="text-center">{p.matchesPlayed}</td>
                          <td className="text-right font-bold">{p.totalBlowjobs}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rychlá správa týmů a hráčů pro sezónu */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-base-300 pt-8">
        {/* Týmy sezóny */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg justify-between">
              <span>Týmy v sezóně ({teams.length})</span>
            </h2>
            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (name?.trim()) {
                  await createTeam({ name: name.trim(), seasonId });
                }
              }}
              className="flex gap-2 my-2"
            >
              <input
                name="name"
                placeholder="Název nového týmu"
                className="input input-bordered input-sm flex-1"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Přidat tým
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              {teams.map((t) => (
                <div key={t.id} className="badge badge-lg gap-2 py-3 px-3">
                  <span>{t.name}</span>
                  <form
                    action={async () => {
                      "use server";
                      await deleteTeam(t.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-ghost btn-xs text-error p-0 h-auto min-h-0"
                    >
                      ✕
                    </button>
                  </form>
                </div>
              ))}
              {teams.length === 0 && (
                <p className="text-base-content/60 text-sm italic">Žádné týmy.</p>
              )}
            </div>
          </div>
        </div>

        {/* Hráči sezóny */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg justify-between">
              <span>Hráči v sezóně ({players.length})</span>
            </h2>
            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (name?.trim()) {
                  await createPlayer({ name: name.trim(), seasonId });
                }
              }}
              className="flex gap-2 my-2"
            >
              <input
                name="name"
                placeholder="Jméno nového hráče"
                className="input input-bordered input-sm flex-1"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Registrovat hráče
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              {players.map((p) => (
                <div key={p.id} className="badge badge-lg badge-outline gap-2 py-3 px-3">
                  <span>{p.name}</span>
                  <form
                    action={async () => {
                      "use server";
                      await deletePlayer(p.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-ghost btn-xs text-error p-0 h-auto min-h-0"
                    >
                      ✕
                    </button>
                  </form>
                </div>
              ))}
              {players.length === 0 && (
                <p className="text-base-content/60 text-sm italic">Žádní hráči.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
