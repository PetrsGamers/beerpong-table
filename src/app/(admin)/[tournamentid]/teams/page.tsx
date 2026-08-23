"use server";

import { getTeamsForTournament } from "@/actions/teams";

export default async function Home({
  params,
}: {
  params: Promise<{ tournamentid: number }>;
}) {
  const { tournamentid } = await params;
  const teams = await getTeamsForTournament(tournamentid);
  console.log(teams);
  return (
    <div>
      tymy: {tournamentid}
      {teams.map((team) => (
        <div key={team.id}>{team.name}</div>
      ))}
    </div>
  );
}
