"use server";
import { getScheduleWithResults } from "@/actions/schedule";
import { getTeamsForTournament } from "@/actions/teams";
import AddNewMatchButton from "@/components/addNewMatchButton";
import CreateTeam from "@/components/createTeam";
import { MatchesOverViewTable } from "@/components/matchesOverviewTable";
import { ScheduleGenerateForm } from "@/components/scheduleGenerateForm";
import { ScheduleMain } from "@/components/scheduleMain";
import StatsTournamentButton from "@/components/statsTournamentButton";
import TournamentTeamTable from "@/components/tournamentTeamTable";
import { pluralCs } from "@/lib/utils";
import { loadMatches, loadTournament, MatchWithTeams } from "./action";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const tournamentId = Number(params.params.tournamentid);
  if (isNaN(tournamentId)) {
    return <div>Invalid tournament ID</div>;
  }

  const [tournament, teams, matches, schedule] = await Promise.all([
    loadTournament(tournamentId),
    getTeamsForTournament(tournamentId),
    loadMatches(tournamentId) as Promise<MatchWithTeams[] | null>,
    getScheduleWithResults(tournamentId),
  ]);

  if (!tournament?.id) {
    return <div>Tournament not found</div>;
  }

  const playedMatches = matches && (
    <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">Odehrané zápasy</h2>
      <MatchesOverViewTable matches={matches} />
    </div>
  );

  // once generated, the schedule is the main page of the tournament
  if (schedule.length > 0) {
    const scheduledTeamIds = new Set(
      schedule.flatMap((m) => [m.team1Id, m.team2Id])
    );
    const isOutdated =
      teams.length !== scheduledTeamIds.size ||
      teams.some((t) => !scheduledTeamIds.has(t.id));

    return (
      <ScheduleMain
        tournamentId={tournamentId}
        tournamentName={tournament.name ?? ""}
        isOutdated={isOutdated}
        schedule={schedule}
      >
        {playedMatches}
      </ScheduleMain>
    );
  }

  // setup: teams with players, then the number of tables and the schedule
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <p className="text-gray-400 mt-2">
            Nastavení turnaje · {pluralCs(teams.length, "tým", "týmy", "týmů")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
            <CreateTeam id={tournamentId} />
          </div>
          <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Týmy v turnaji</h2>
            <TournamentTeamTable id={tournamentId} />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-2">Rozpis zápasů</h2>
          <p className="text-gray-400 mb-4">
            {teams.length < 2
              ? "Přidej alespoň 2 týmy, pak zadej počet stolů a vygeneruj rozpis."
              : "Zadej počet stolů a vygeneruj rozpis. Rozpis se pak stane hlavní stránkou turnaje."}
          </p>
          <ScheduleGenerateForm
            tournamentId={tournamentId}
            defaultTables={1}
            hasSchedule={false}
            disabled={teams.length < 2}
          />
        </div>

        {playedMatches && (
          <>
            <div className="flex justify-end space-x-4">
              <StatsTournamentButton id={tournamentId} />
              <AddNewMatchButton id={tournamentId} matches={matches!} />
            </div>
            {playedMatches}
          </>
        )}
      </div>
    </div>
  );
}
