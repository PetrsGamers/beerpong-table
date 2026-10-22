import { getAllSeasons } from "@/actions/seasons";
import { getAllTournaments } from "@/actions/tournaments";
import Link from "next/link";

export default async function HomePage() {
  const [seasons, tournaments] = await Promise.all([
    getAllSeasons(),
    getAllTournaments(),
  ]);

  return (
    <div className="min-h-screen p-8 sm:p-12 max-w-6xl mx-auto flex flex-col gap-10">
      <div className="hero bg-base-200 rounded-3xl p-8 sm:p-12 border border-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold mb-4">🦊 SPPDF BeerPong 2.0</h1>
            <p className="py-2 text-base-content/80 text-lg">
              Systém pro správu Beer Pong sezón, turnajů, dynamických týmů a statistik hráčů.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Link href="/seasons" className="btn btn-primary">
                Spravovat sezóny
              </Link>
              <Link href="/tournaments" className="btn btn-outline">
                Zobrazit turnaje
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sezóny */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl font-bold">Aktuální sezóny</h2>
              <Link href="/seasons" className="btn btn-ghost btn-sm">
                Všechny sezóny →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {seasons.map((s) => (
                <Link
                  key={s.id}
                  href={`/seasons/${s.id}`}
                  className="flex justify-between items-center p-4 rounded-xl bg-base-200 hover:bg-base-300 transition-colors"
                >
                  <span className="font-semibold text-lg">{s.name}</span>
                  <span className="btn btn-sm btn-ghost">Otevřít →</span>
                </Link>
              ))}
              {seasons.length === 0 && (
                <p className="text-base-content/60 italic">Žádné sezóny zatím nebyly vytvořeny.</p>
              )}
            </div>
          </div>
        </div>

        {/* Turnaje */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl font-bold">Turnaje</h2>
              <Link href="/tournaments" className="btn btn-ghost btn-sm">
                Všechny turnaje →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {tournaments.map((t) => (
                <Link
                  key={t.id}
                  href={`/seasons/${t.seasonId}/tournaments`}
                  className="flex justify-between items-center p-4 rounded-xl bg-base-200 hover:bg-base-300 transition-colors"
                >
                  <span className="font-semibold">{t.name}</span>
                  <span className="btn btn-sm btn-ghost">Detail →</span>
                </Link>
              ))}
              {tournaments.length === 0 && (
                <p className="text-base-content/60 italic">Žádné turnaje zatím nebyly vytvořeny.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
