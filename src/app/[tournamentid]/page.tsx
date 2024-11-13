"use server";
import AddNewMatchButton from "@/components/addNewMatchButton";
import CreateTeam from "@/components/createTeam";
import { MatchesOverViewTable } from "@/components/matchesOverviewTable";
import StatsTournamentButton from "@/components/statsTournamentButton";
import TournamentTeamTable from "@/components/tournamentTeamTable";
import { loadMatches, loadTournament } from "./action";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const matches = await loadMatches(params.params.tournamentid);
  const tournament = await loadTournament(params.params.tournamentid);

  return (
    <>
      {/* <div className="flex flex-col gap-2 mb-4">
        <div>ID TURNAJE: {tournament.id}</div>
        <div>JMENO TURNAJE: {tournament.name}</div>
      </div> */}
      <div className="grid grid-rows-[1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          {matches ? (
            <MatchesOverViewTable matches={matches} />
          ) : (
            <>
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-2xl font-bold mb-4">
                  No matches available
                </h1>
                <CreateTeam id={tournament.id} />
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <TournamentTeamTable id={tournament.id} />
              </div>
            </>
          )}
        </main>
        <div className="flex justify-between items-center px-8 py-4">
          <StatsTournamentButton id={tournament.id} />
          <AddNewMatchButton id={tournament.id} />
        </div>
      </div>
    </>
  );
}
