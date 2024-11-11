"use server";
import { getPlayersForTournamentId } from "@/actions/players";
import { getTeamsForTournamentSorted } from "@/actions/teams";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const playersBJ = await getPlayersForTournamentId(params.params.tournamentid);
  const playersSC = await getPlayersForTournamentId(params.params.tournamentid);
  const teamsOrdered = await getTeamsForTournamentSorted(
    params.params.tournamentid
  );

  const playersSortedByBlowjobs = playersBJ.sort(
    (a, b) => (Number(b.blowjobs) ?? 0) - (Number(a.blowjobs) ?? 0)
  );
  const playersSortedByScore = playersSC.sort(
    (a, b) => (Number(b.score) ?? 0) - (Number(a.score) ?? 0)
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-between w-full text-center gap-8 row-start-3">
          <div className="rounded-lg text-center shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Celkové skóre</h2>
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Pořadí</th>
                  <th className="px-4 py-2">Tým</th>
                  <th className="px-4 py-2">Skóre</th>
                </tr>
              </thead>
              <tbody>
                {teamsOrdered.map((team) => (
                  <tr
                    key={team.id}
                    className={
                      teamsOrdered.indexOf(team) === 0
                        ? "bg-lime-600 text-black font-bold p-4"
                        : teamsOrdered.indexOf(team) === 1
                        ? "bg-orange-400 text-black font-bold p-4"
                        : teamsOrdered.indexOf(team) === 2
                        ? "bg-yellow-500 text-black font-bold p-4"
                        : ""
                    }
                  >
                    <td className="py-2">{teamsOrdered.indexOf(team) + 1}.</td>
                    <td className="py-2">{team.name}</td>
                    <td className="py-2">{team.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className=" rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Král střelců</h2>
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Pořadí</th>
                  <th className="px-4 py-2">Hráč</th>
                  <th className="px-4 py-2">Skóre</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {playersSortedByScore.map((player) => (
                  <tr
                    key={player.id}
                    className={
                      playersSortedByScore.indexOf(player) === 0
                        ? " bg-lime-600  text-black font-bold p-4"
                        : ""
                    }
                  >
                    <td className="py-2">
                      {playersSortedByScore.indexOf(player) + 1}.
                    </td>
                    <td className="py-2">{player.name}</td>
                    <td className="py-2">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">BlowJob King</h2>
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Pořadí</th>
                  <th className="px-4 py-2">Hráč</th>
                  <th className="px-4 py-2">Počet blowjobů</th>
                </tr>
              </thead>
              <tbody>
                {playersSortedByBlowjobs.map((player) => (
                  <tr
                    key={player.id}
                    className={
                      playersSortedByBlowjobs.indexOf(player) === 0
                        ? " bg-lime-600  text-black font-bold p-4"
                        : ""
                    }
                  >
                    <td className="py-2">
                      {playersSortedByBlowjobs.indexOf(player) + 1}.
                    </td>
                    <td className="py-2">{player.name}</td>
                    <td className="py-2">{player.blowjobs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
