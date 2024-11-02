"use server";
import { getAllTournaments } from "@/actions/tournaments";
import { redirect } from "next/navigation";

export default async function Home() {
  const tournaments = await getAllTournaments();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
        {tournaments.map((tournament) => (
          <div className="card bg-base-100 w-96 shadow-xl" key={tournament.id}>
            <div className="card-body">
              <h2 className="card-title">{tournament.name}</h2>
              <p>Počet týmů: Počet zápasů:</p>
              <div className="card-actions justify-end">
                <button
                  onClick={() => redirect("/" + tournament.id)}
                  className="btn btn-primary"
                >
                  Detaily
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
