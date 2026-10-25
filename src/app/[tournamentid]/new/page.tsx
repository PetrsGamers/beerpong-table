"use server";
import { getTeamsForTournament } from "@/actions/teams";
import { ScoreInputTable } from "@/components/score_input_table";
import Link from "next/link";

export default async function Home(params: {
  params: { tournamentid: number };
  searchParams: { team1?: string; team2?: string };
}) {
  const teams = (await getTeamsForTournament(params.params.tournamentid)).sort(
    (a, b) => (a.name ?? "").localeCompare(b.name ?? "", "cs")
  );
  const initialTeam1Id = Number(params.searchParams.team1) || undefined;
  const initialTeam2Id = Number(params.searchParams.team2) || undefined;
  const fromSchedule = initialTeam1Id !== undefined;
  const tournamentHref = `/${params.params.tournamentid}`;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Link href={tournamentHref} className="text-blue-400 hover:underline">
          ← Zpět na turnaj
        </Link>
        <ScoreInputTable
          teams={teams}
          tournamentId={params.params.tournamentid}
          initialTeam1Id={initialTeam1Id}
          initialTeam2Id={initialTeam2Id}
          returnTo={fromSchedule ? tournamentHref : undefined}
        />
      </main>
    </div>
  );
}
