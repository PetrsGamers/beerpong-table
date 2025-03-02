"use server";
import { getTeamsForTournament } from "@/actions/teams";
import AddNewMatchButton from "@/components/addNewMatchButton";
import CreateTeam from "@/components/createTeam";
import { MatchesOverViewTable } from "@/components/matchesOverviewTable";
import StatsTournamentButton from "@/components/statsTournamentButton";
import TournamentTeamTable from "@/components/tournamentTeamTable";
import { loadMatches, loadTournament, MatchWithTeams } from "./action";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const matches: MatchWithTeams[] | null = await loadMatches(
    params.params.tournamentid
  );
  if (isNaN(params.params.tournamentid)) {
    return <div>Invalid tournament ID</div>;
  }

  const tournament = await loadTournament(params.params.tournamentid);
  const teams = await getTeamsForTournament(params.params.tournamentid);

  if (!tournament?.id) {
    return <div>Tournament not found</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Tournament Header */}
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            {matches && (
              <p className="text-gray-400 mt-2">
                Total Matches: {matches.length}
                {matches.length === (teams.length * (teams.length - 1)) / 2 ? (
                  <span className="text-green-500">
                    {" "}
                    (All matches expected)
                  </span>
                ) : (
                  <span className="text-red-500">
                    ({(teams.length * (teams.length - 1)) / 2} expected)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <StatsTournamentButton id={params.params.tournamentid} />
            <AddNewMatchButton
              id={params.params.tournamentid}
              matches={matches || undefined}
            />
          </div>

          {/* Main Content */}
          <main
            className={matches ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}
          >
            {matches ? (
              <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Match Overview</h2>
                <MatchesOverViewTable matches={matches} />
              </div>
            ) : (
              <>
                <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
                  <CreateTeam id={params.params.tournamentid} />
                </div>
                <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Tournament Teams
                  </h2>
                  <TournamentTeamTable id={params.params.tournamentid} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
