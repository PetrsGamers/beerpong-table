"use server";

import { getMatchesForTournament } from "@/actions/matches";
import { loadAllTeams } from "@/actions/teams";
import { getAllTournaments } from "@/actions/tournaments";
import CreateTournamentButton from "@/components/CreateTournametButton";
import MultiTournamentExport from "@/components/MultiTournamentExport";
import TournamentDetailsButton from "@/components/TournametDetailsButton";

export default async function Home() {
  const tournaments = await getAllTournaments();
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-12">
      <main className="mx-auto w-full max-w-[1280px] flex flex-col gap-8 items-center">
        <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {tournaments.map(async (tournament) => (
            <div
              className="card bg-base-100 w-full max-w-sm shadow-xl"
              key={tournament.id}
            >
              <div className="card-body">
                <h2 className="card-title">{tournament.name}</h2>
                <p>
                  Počet týmů: {(await loadAllTeams(tournament.id)).length}
                  <br />
                  Počet zápasů:
                  {(await getMatchesForTournament(tournament.id)).length}
                </p>
                <div className="card-actions justify-end">
                  <TournamentDetailsButton id={tournament.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="fixed bottom-8 left-8">
        <MultiTournamentExport tournaments={tournaments} />
      </div>
      <div className="fixed bottom-8 right-8">
        <CreateTournamentButton />
      </div>
    </div>
  );
}
