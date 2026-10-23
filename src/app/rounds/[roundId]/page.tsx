import { getRoundById, updateRound } from "@/actions/rounds";
import { getSeasonById } from "@/actions/seasons";
import {
  getMatchesForRound,
  createMatch,
  deleteMatch,
  getMatchById,
} from "@/actions/matches";
import {
  getRoundTeamStandings,
  getRoundPlayerLeaderboard,
  getPlayerScoresForMatch,
} from "@/actions/stats";
import {
  getTeamsForSeason,
  assignPlayerToTeamInRound,
  removePlayerFromTeamInRound,
  getTeamPlayersForRound,
} from "@/actions/teams";
import { getPlayersForSeason } from "@/actions/players";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RoundDetailPage({
  params,
}: {
  params: { roundId: string };
}) {
  const roundId = Number(params.roundId);
  if (isNaN(roundId)) return notFound();

  const currentRound = await getRoundById(roundId);
  if (!currentRound) return notFound();

  const [
    currentSeason,
    matches,
    teamStandings,
    playerStats,
    teams,
    players,
    roster,
  ] = await Promise.all([
    getSeasonById(currentRound.seasonId),
    getMatchesForRound(roundId),
    getRoundTeamStandings(roundId),
    getRoundPlayerLeaderboard(roundId),
    getTeamsForSeason(currentRound.seasonId),
    getPlayersForSeason(currentRound.seasonId),
    getTeamPlayersForRound(roundId),
  ]);

  // Získáme detailní skóre hráčů pro každý zápas večera
  const matchesWithDetails = await Promise.all(
    matches.map(async (m) => ({
      ...m,
      playerScores: await getPlayerScoresForMatch(m.id),
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Header & Breadcrumbs */}
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
              <li>
                <Link href={`/seasons/${currentRound.seasonId}`}>
                  {currentSeason?.name}
                </Link>
              </li>
              <li className="font-semibold">{currentRound.name}</li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black">
              {currentRound.name}
            </h1>
            <span
              className={`badge ${
                currentRound.isCompleted ? "badge-success" : "badge-warning"
              } font-semibold`}
            >
              {currentRound.isCompleted ? "Dokončeno" : "Probíhá / Plánováno"}
            </span>
          </div>
          <p className="text-base-content/70 text-sm mt-1">
            Semestr: <strong>{currentSeason?.name}</strong> • Večer #{currentRound.roundNumber}
            {currentRound.date && ` • 📅 ${new Date(currentRound.date).toLocaleDateString("cs-CZ")}`}
          </p>
        </div>

        {/* Přepínač stavu dokončení večera */}
        <form
          action={async () => {
            "use server";
            await updateRound(currentRound.id, {
              isCompleted: !currentRound.isCompleted,
            });
          }}
        >
          <button
            type="submit"
            className={`btn btn-sm ${
              currentRound.isCompleted ? "btn-outline" : "btn-success"
            }`}
          >
            {currentRound.isCompleted
              ? "↩ Znovu otevřít večer"
              : "✓ Označit večer jako dohraný"}
          </button>
        </form>
      </div>

      {/* Rychlý přehled: Tabulka večera a Králové kola */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabulka večera */}
        <section className="card bg-base-100 shadow-xl border border-base-300 lg:col-span-2">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold flex items-center gap-2 mb-2">
              🏆 Pořadí večera ({currentRound.name})
            </h2>
            <p className="text-sm text-base-content/70 mb-4">
              Výsledky a body získané týmy během tohoto konkrétního večera
            </p>

            {teamStandings.length === 0 ? (
              <p className="text-base-content/60 italic py-6 text-center">
                V tomto kole zatím nebyly zapsány žádné výsledky.
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
                      <th className="text-right">Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map((t, idx) => (
                      <tr
                        key={t.teamId}
                        className={idx === 0 ? "bg-warning/15 font-bold" : ""}
                      >
                        <td>{idx + 1}.</td>
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

        {/* Králové večera */}
        <section className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold flex items-center gap-2 mb-2">
              👑 Králové večera
            </h2>
            <p className="text-sm text-base-content/70 mb-4">
              Nejlepší střelci a obránci v tomto kole
            </p>

            {playerStats.length === 0 ? (
              <p className="text-base-content/60 italic py-6 text-center">
                Žádné statistiky.
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
                    {playerStats.slice(0, 8).map((p, idx) => (
                      <tr
                        key={p.playerId}
                        className={idx === 0 ? "bg-warning/15 font-bold" : ""}
                      >
                        <td>{idx + 1}.</td>
                        <td className="font-semibold">{p.playerName}</td>
                        <td className="text-center font-bold font-mono text-primary">
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

      {/* Zápasy večera */}
      <section className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="card-title text-2xl font-bold">
                ⚔️ Zápasy turnajového večera
              </h2>
              <p className="text-sm text-base-content/70">
                Odehraná utkání, konečný stav a individuální zásahy hráčů
              </p>
            </div>
            <span className="badge badge-neutral text-sm">
              {matchesWithDetails.length} zápasů
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {matchesWithDetails.map((m) => (
              <div
                key={m.id}
                className="flex flex-col bg-base-200/60 p-5 rounded-2xl border border-base-300 gap-4"
              >
                {/* Zápasový řádek */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex-1 text-center sm:text-right font-bold text-lg">
                    {m.team1Name}
                  </div>
                  <div className="badge badge-lg font-black px-6 py-4 bg-base-100 text-xl border-base-300 shadow-inner">
                    {m.team1Score} : {m.team2Score}
                  </div>
                  <div className="flex-1 text-center sm:text-left font-bold text-lg">
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
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      title="Smazat zápas"
                    >
                      ✕ Smazat
                    </button>
                  </form>
                </div>

                {/* Individuální body hráčů v tomto zápase */}
                {m.playerScores && m.playerScores.length > 0 && (
                  <div className="border-t border-base-300/80 pt-3 flex flex-wrap justify-between gap-4 text-xs">
                    {/* Tým 1 střelci */}
                    <div className="flex-1 flex flex-col gap-1 items-start sm:items-end">
                      <span className="font-bold text-base-content/60 uppercase">
                        {m.team1Name}:
                      </span>
                      {m.playerScores
                        .filter((ps) => ps.teamId === m.team1Id)
                        .map((ps) => (
                          <span
                            key={ps.id}
                            className="badge badge-ghost badge-sm gap-1"
                          >
                            <strong>{ps.playerName}</strong>: {ps.score} 🎯
                            {ps.blowjobs > 0 && ` • ${ps.blowjobs} 🌬️`}
                          </span>
                        ))}
                    </div>

                    {/* Tým 2 střelci */}
                    <div className="flex-1 flex flex-col gap-1 items-start">
                      <span className="font-bold text-base-content/60 uppercase">
                        {m.team2Name}:
                      </span>
                      {m.playerScores
                        .filter((ps) => ps.teamId === m.team2Id)
                        .map((ps) => (
                          <span
                            key={ps.id}
                            className="badge badge-ghost badge-sm gap-1"
                          >
                            <strong>{ps.playerName}</strong>: {ps.score} 🎯
                            {ps.blowjobs > 0 && ` • ${ps.blowjobs} 🌬️`}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {matchesWithDetails.length === 0 && (
              <p className="text-base-content/60 italic py-6 text-center">
                V tomto kole zatím neproběhl žádný zápas. Zapiš výsledek níže.
              </p>
            )}
          </div>

          {/* Formulář pro zápis nového zápasu večera */}
          {teams.length >= 2 && (
            <div className="mt-8 pt-6 border-t border-base-300">
              <h3 className="font-bold text-lg mb-3">
                ➕ Zapsat výsledek zápasu
              </h3>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const team1Id = Number(formData.get("team1Id"));
                  const team2Id = Number(formData.get("team2Id"));
                  const team1Score = Number(formData.get("team1Score"));
                  const team2Score = Number(formData.get("team2Score"));

                  if (team1Id && team2Id && team1Id !== team2Id) {
                    // Přečteme volitelné individuální skóre hráčů
                    const playerScoresData: {
                      playerId: number;
                      teamId: number;
                      score: number;
                      blowjobs: number;
                    }[] = [];

                    for (const p of players) {
                      const scoreVal = formData.get(`p_score_${p.id}`);
                      const bjVal = formData.get(`p_bj_${p.id}`);
                      const teamVal = formData.get(`p_team_${p.id}`);

                      if (scoreVal !== null || bjVal !== null) {
                        const score = Number(scoreVal) || 0;
                        const bj = Number(bjVal) || 0;
                        const assignedTeamId = Number(teamVal);

                        if (
                          (score > 0 || bj > 0) &&
                          (assignedTeamId === team1Id || assignedTeamId === team2Id)
                        ) {
                          playerScoresData.push({
                            playerId: p.id,
                            teamId: assignedTeamId,
                            score,
                            blowjobs: bj,
                          });
                        }
                      }
                    }

                    await createMatch({
                      roundId,
                      team1Id,
                      team2Id,
                      team1Score: isNaN(team1Score) ? 0 : team1Score,
                      team2Score: isNaN(team2Score) ? 0 : team2Score,
                      status: "completed",
                      playerScores:
                        playerScoresData.length > 0 ? playerScoresData : undefined,
                    });
                  }
                }}
                className="flex flex-col gap-4 bg-base-200/50 p-5 rounded-2xl border border-base-300"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <label className="label label-text font-bold">Tým 1</label>
                    <select
                      name="team1Id"
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Vyber tým 1</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-20">
                    <label className="label label-text font-bold text-center">
                      Skóre 1
                    </label>
                    <input
                      name="team1Score"
                      type="number"
                      min="0"
                      className="input input-bordered w-full text-center font-bold text-lg"
                      defaultValue="10"
                      required
                    />
                  </div>

                  <div className="text-xl font-bold self-end pb-3">:</div>

                  <div className="w-20">
                    <label className="label label-text font-bold text-center">
                      Skóre 2
                    </label>
                    <input
                      name="team2Score"
                      type="number"
                      min="0"
                      className="input input-bordered w-full text-center font-bold text-lg"
                      defaultValue="7"
                      required
                    />
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <label className="label label-text font-bold">Tým 2</label>
                    <select
                      name="team2Id"
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Vyber tým 2</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Volitelný zápis individuálních kelímků hráčů */}
                {players.length > 0 && (
                  <details className="mt-2 bg-base-100 p-4 rounded-xl border border-base-300">
                    <summary className="font-bold text-sm cursor-pointer hover:text-primary">
                      🎯 Přidat individuální kelímky a blowjoby hráčů (volitelné)
                    </summary>
                    <p className="text-xs text-base-content/70 mt-1 mb-3">
                      Zadej, kolik kelímků hráč v zápase trefil (🎯) a kolik vyfoukl (🌬️), a vyber za jaký tým v tomto zápase hrál.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {players.map((p) => {
                        // Zjistíme, jestli má hráč pro toto kolo nastavený tým
                        const currentRosterTeam = roster.find(
                          (r) => r.playerId === p.id
                        );
                        return (
                          <div
                            key={p.id}
                            className="flex flex-col gap-1 p-2 bg-base-200/50 rounded-lg text-xs"
                          >
                            <span className="font-bold">{p.name}</span>
                            <div className="flex items-center gap-1">
                              <select
                                name={`p_team_${p.id}`}
                                className="select select-bordered select-xs flex-1"
                                defaultValue={currentRosterTeam?.teamId || ""}
                              >
                                <option value="">Tým...</option>
                                {teams.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                              <input
                                name={`p_score_${p.id}`}
                                type="number"
                                min="0"
                                placeholder="🎯"
                                className="input input-bordered select-xs w-14 text-center font-mono"
                              />
                              <input
                                name={`p_bj_${p.id}`}
                                type="number"
                                min="0"
                                placeholder="🌬️"
                                className="input input-bordered select-xs w-14 text-center font-mono"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}

                <div className="flex justify-end mt-2">
                  <button type="submit" className="btn btn-primary">
                    Uložit výsledek zápasu
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Soupisky pro tento turnajový večer (dynamické týmy) */}
      <section className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="card-title text-xl font-bold">
                👥 Soupisky týmů pro tento večer
              </h2>
              <p className="text-sm text-base-content/70">
                Hráči mohou v jednotlivých kolech nastupovat za různé týmy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
            {teams.map((t) => {
              const teamMembers = roster.filter((r) => r.teamId === t.id);
              return (
                <div
                  key={t.id}
                  className="card bg-base-200/70 border border-base-300 p-4 rounded-xl flex flex-col gap-2"
                >
                  <h3 className="font-bold text-base flex justify-between items-center">
                    <span>{t.name}</span>
                    <span className="badge badge-sm badge-neutral">
                      {teamMembers.length}
                    </span>
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    {teamMembers.map((m) => (
                      <div
                        key={m.id}
                        className="flex justify-between items-center bg-base-100 px-2 py-1 rounded text-xs"
                      >
                        <span>{m.playerName}</span>
                        <form
                          action={async () => {
                            "use server";
                            await removePlayerFromTeamInRound(roundId, m.playerId);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-error hover:font-bold"
                            title="Odebrat z týmu pro toto kolo"
                          >
                            ✕
                          </button>
                        </form>
                      </div>
                    ))}
                    {teamMembers.length === 0 && (
                      <span className="text-xs text-base-content/50 italic">
                        Žádní hráči zatím nepřiřazeni.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rychlé přiřazení hráče na dnešní večer */}
          {players.length > 0 && teams.length > 0 && (
            <form
              action={async (formData: FormData) => {
                "use server";
                const playerId = Number(formData.get("playerId"));
                const teamId = Number(formData.get("teamId"));
                if (playerId && teamId) {
                  await assignPlayerToTeamInRound(roundId, teamId, playerId);
                }
              }}
              className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-base-300"
            >
              <span className="text-xs font-bold uppercase text-base-content/70 mr-1">
                Přiřadit hráče na dnešní večer:
              </span>
              <select
                name="playerId"
                className="select select-bordered select-sm"
                required
              >
                <option value="">Vyber hráče...</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span>hraje za</span>
              <select
                name="teamId"
                className="select select-bordered select-sm"
                required
              >
                <option value="">Vyber tým...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-sm">
                Přiřadit
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
