import { getTournamentById } from "@/actions/tournaments";
import { getSeasonById } from "@/actions/seasons";
import { getRoundsForTournament, createRound } from "@/actions/rounds";
import { getTeamsForSeason } from "@/actions/teams";
import { getPlayersForSeason } from "@/actions/players";
import { getMatchesForRound, createMatch, deleteMatch } from "@/actions/matches";
import {
  getTournamentPlayerLeaderboard,
  getTournamentTeamStandings,
} from "@/actions/stats";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TournamentDetailPage({
  params,
}: {
  params: { seasonId: string; tournamentId: string };
}) {
  const seasonId = Number(params.seasonId);
  const tournamentId = Number(params.tournamentId);
  if (isNaN(seasonId) || isNaN(tournamentId)) return notFound();

  const [currentSeason, currentTournament, rounds, teams, players, playerStats, teamStandings] =
    await Promise.all([
      getSeasonById(seasonId),
      getTournamentById(tournamentId),
      getRoundsForTournament(tournamentId),
      getTeamsForSeason(seasonId),
      getPlayersForSeason(seasonId),
      getTournamentPlayerLeaderboard(tournamentId),
      getTournamentTeamStandings(tournamentId),
    ]);

  if (!currentTournament) return notFound();

  // Získáme zápasy pro všechna kola tohoto turnaje
  const roundMatches = await Promise.all(
    rounds.map(async (r) => ({
      round: r,
      matches: await getMatchesForRound(r.id),
    }))
  );

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
              <li>
                <Link href={`/seasons/${seasonId}`}>{currentSeason?.name}</Link>
              </li>
              <li>
                <Link href={`/seasons/${seasonId}/tournaments`}>Turnaje</Link>
              </li>
              <li>{currentTournament.name}</li>
            </ul>
          </div>
          <h1 className="text-3xl font-extrabold">{currentTournament.name}</h1>
          <p className="text-base-content/70 text-sm">
            Sezóna: {currentSeason?.name}
          </p>
        </div>
      </div>

      {/* Tabulka turnaje */}
      <section className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">
            🏆 Tabulka turnaje
          </h2>
          {teamStandings.length === 0 ? (
            <p className="text-base-content/60 italic">Zatím žádné odehrané zápasy v tomto turnaji.</p>
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

      {/* Král střelců a BlowJob King turnaje */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">🎯 Král střelců turnaje</h2>
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

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">💨 BlowJob King turnaje</h2>
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

      {/* Kola a zápasy turnaje */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Kola a zápasy turnaje</h2>
          <form
            action={async (formData: FormData) => {
              "use server";
              const name = formData.get("name") as string;
              if (name?.trim()) {
                await createRound({
                  name: name.trim(),
                  tournamentId,
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

        {roundMatches.map(({ round, matches }) => (
          <div
            key={round.id}
            className="card bg-base-200 border border-base-300 shadow-md"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4 border-b border-base-300 pb-2">
                <h3 className="card-title text-lg font-bold">
                  {round.name} (Kolo #{round.roundNumber})
                </h3>
                <span className="text-sm text-base-content/70">
                  {matches.length} zápasů
                </span>
              </div>

              {/* Zápasy v kole */}
              <div className="flex flex-col gap-3">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row justify-between items-center bg-base-100 p-4 rounded-xl border border-base-300 gap-4"
                  >
                    <div className="flex-1 text-right font-semibold">
                      {m.team1Name}
                    </div>
                    <div className="badge badge-lg font-bold px-4 py-3 bg-base-200 text-lg border-base-300">
                      {m.team1Score} : {m.team2Score}
                    </div>
                    <div className="flex-1 text-left font-semibold">
                      {m.team2Name}
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await deleteMatch(m.id);
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

                {matches.length === 0 && (
                  <p className="text-base-content/60 text-sm italic py-2">
                    V tomto kole zatím nejsou vytvořeny žádné zápasy.
                  </p>
                )}
              </div>

              {/* Formulář pro přidání zápasu do tohoto kola */}
              {teams.length >= 2 && (
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const team1Id = Number(formData.get("team1Id"));
                    const team2Id = Number(formData.get("team2Id"));
                    const team1Score = Number(formData.get("team1Score"));
                    const team2Score = Number(formData.get("team2Score"));

                    if (team1Id && team2Id && team1Id !== team2Id) {
                      await createMatch({
                        roundId: round.id,
                        team1Id,
                        team2Id,
                        team1Score: isNaN(team1Score) ? 0 : team1Score,
                        team2Score: isNaN(team2Score) ? 0 : team2Score,
                        status: "completed",
                      });
                    }
                  }}
                  className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-base-300"
                >
                  <span className="text-xs font-bold uppercase text-base-content/70 mr-2">
                    Nový zápas:
                  </span>
                  <select
                    name="team1Id"
                    className="select select-bordered select-sm"
                    required
                  >
                    <option value="">Vyber tým 1</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="team1Score"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="input input-bordered input-sm w-16 text-center"
                    defaultValue="10"
                    required
                  />
                  <span>:</span>
                  <input
                    name="team2Score"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="input input-bordered input-sm w-16 text-center"
                    defaultValue="7"
                    required
                  />
                  <select
                    name="team2Id"
                    className="select select-bordered select-sm"
                    required
                  >
                    <option value="">Vyber tým 2</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary btn-sm ml-auto">
                    Uložit výsledek zápasu
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}

        {rounds.length === 0 && (
          <p className="text-base-content/60 italic py-6">
            Zatím nebylo vytvořeno žádné kolo. Přidej první kolo formulářem výše.
          </p>
        )}
      </section>
    </div>
  );
}
