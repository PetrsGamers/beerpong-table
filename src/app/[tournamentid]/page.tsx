"use server";
import CreateTeam from "@/components/createTeam";
import TournamentTeamTable from "@/components/tournamentTeamTable";
import { checkMatches, loadTournament } from "./action";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const matches = await checkMatches(params.params.tournamentid);
  const tournament = await loadTournament(params.params.tournamentid);
  return (
    <>
      ID TURNAJE :{tournament.id}
      JMENO TURNAJE: {tournament.name}
      {matches.bool ? (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            Unique overview of matches in the tournament
            <table>
              <thead>
                <tr>
                  <th>Column 1</th>
                  <th>Column 2</th>
                  <th>Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Row 1, Cell 1</td>
                  <td>Row 1, Cell 2</td>
                  <td>Row 1, Cell 3</td>
                </tr>
                <tr>
                  <td colSpan={2}>Row 2, Cell 1 (spans 2 columns)</td>
                  <td>Row 2, Cell 2</td>
                </tr>
                <tr>
                  <td>Row 3, Cell 1</td>
                  <td colSpan={2}>Row 3, Cell 2 (spans 2 columns)</td>
                </tr>
              </tbody>
            </table>
          </main>
        </div>
      ) : (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="grid grid-cols-1 sm:grid-cols-2 gap-8 row-start-2 items-start">
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-2xl font-bold mb-4">No matches available</h1>
              <CreateTeam id={matches.id} />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <TournamentTeamTable id={matches.id} />
            </div>
          </main>
        </div>
      )}
    </>
  );
}
