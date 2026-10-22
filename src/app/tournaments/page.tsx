import { getAllTournaments } from "@/actions/tournaments";
import { getSeasonById } from "@/actions/seasons";
import Link from "next/link";

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Všechny turnaje</h1>
        <Link href="/seasons" className="btn btn-outline btn-sm">
          Přejít na sezóny
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map(async (t) => {
          const s = await getSeasonById(t.seasonId);
          return (
            <div
              className="card bg-base-100 shadow-xl border border-base-300"
              key={t.id}
            >
              <div className="card-body">
                <h2 className="card-title">{t.name}</h2>
                <p className="text-base-content/70">
                  Sezóna: {s?.name ?? "-"}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href={`/seasons/${t.seasonId}/tournaments`}
                    className="btn btn-primary btn-sm"
                  >
                    Zobrazit turnaj
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
