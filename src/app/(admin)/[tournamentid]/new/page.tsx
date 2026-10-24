"use server";
import { getTeamsForTournament } from "@/actions/teams";
import { ScoreInputTable } from "@/components/score_input_table";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const teams = await getTeamsForTournament(params.params.tournamentid);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ScoreInputTable
          teams={teams}
          tournamentId={params.params.tournamentid}
        />
      </main>
    </div>
  );
}
