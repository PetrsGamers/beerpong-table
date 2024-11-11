"use server";
import AddNewMatchButton from "@/components/addNewMatchButton";
import CreateTeam from "@/components/createTeam";
import { MatchesOverViewTable } from "@/components/matchesOverviewTable";
import StatsTournamentButton from "@/components/statsTournamentBUtton";
import TournamentTeamTable from "@/components/tournamentTeamTable";
import { loadMatches, loadTournament } from "./action";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const matches = await loadMatches(params.params.tournamentid);
  const tournament = await loadTournament(params.params.tournamentid);
  return (
    <>
      ID TURNAJE :{tournament.id}
      JMENO TURNAJE: {tournament.name}
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="grid grid-cols-1 sm:grid-cols-2 gap-8 row-start-2 items-start">
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
        <div className="fixed bottom-8 right-8">
          <AddNewMatchButton id={tournament.id} />
        </div>
        <div className="fixed left-8 right-8">
          <StatsTournamentButton id={tournament.id} />
        </div>
      </div>
    </>
  );
}
