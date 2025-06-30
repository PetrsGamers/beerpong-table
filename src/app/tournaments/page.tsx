"use server";

import { getMatchesForTournament } from "@/actions/matches";
import { loadAllTeams } from "@/actions/teams";
import { getAllTournaments } from "@/actions/tournaments";
import CreateTournamentButton from "@/components/CreateTournametButton";
import TournamentDetailsButton from "@/components/TournametDetailsButton";

export default async function Home() {
  const tournaments = await getAllTournaments();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {tournaments.map(async (tournament) => (
            <div
              className="card bg-base-100 w-96 shadow-xl"
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
      <div className="fixed bottom-8 right-8">
        <CreateTournamentButton />
      </div>
    </div>
  );
}
