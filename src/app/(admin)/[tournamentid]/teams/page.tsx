"use server";

import { getTeamsForTournament } from "@/actions/teams";

export default async function Home(params: {
  params: { tournamentid: number };
}) {
  const teams = await getTeamsForTournament(params.params.tournamentid);
  console.log(teams);
  return (
    <div>
      tymy: {params.params.tournamentid}
      {teams.map((team) => (
        <div key={team.id}>{team.name}</div>
      ))}
    </div>
  );
}
