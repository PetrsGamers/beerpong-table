"use server";
import { getPlayersForTournamentId } from "@/actions/players";
import { getTeamsForTournament } from "@/actions/teams";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const teams = await getTeamsForTournament(params.params.tournamentid);
  const playersBJ = await getPlayersForTournamentId(params.params.tournamentid);
  const playersSC = await getPlayersForTournamentId(params.params.tournamentid);

  const playersSortedByBlowjobs = playersBJ.sort(
    (a, b) => (Number(b.blowjobs) ?? 0) - (Number(a.blowjobs) ?? 0)
  );
  const playersSortedByScore = playersSC.sort(
    (a, b) => (Number(b.score) ?? 0) - (Number(a.score) ?? 0)
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-between w-full gap-8 row-start-3">
          <div className="rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Table 1</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2">Header 1</th>
                  <th className="py-2">Header 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">Data 1</td>
                  <td className="py-2">Data 2</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className=" rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Table 2</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2">Header 1</th>
                  <th className="py-2">Header 2</th>
                </tr>
              </thead>
              <tbody>
                {playersSortedByScore.map((player) => (
                  <tr key={player.id}>
                    <td className="py-2">{player.name}</td>
                    <td className="py-2">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className=" rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">BlowJob King</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2">Jméno hráče</th>
                  <th className="py-2">Počet blowjobů</th>
                </tr>
              </thead>
              <tbody>
                {playersSortedByBlowjobs.map((player) => (
                  <tr key={player.id}>
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
