"use server";
import { loadAllTeams } from "@/actions/teams";
import DeleteTeamButton from "@/components/deleteTeamButton";
interface Player {
  id: number;
  name: string;
  score: number | null;
  blowjobs: number | null;
}

interface Team {
  id: number;
  name: string;
  score: number | null;
  player1_id: number;
  player2_id: number;
  tournament_id: number;
}

interface TeamWithPlayers {
  team: Team;
  player1: Player | null;
  player2: Player | null;
}
export default async function TournamentTeamTable(id: { id: number }) {
  const tournamentTeamData = await loadAllTeams(id.id);
  console.log(tournamentTeamData);
  return (
    <>
      {tournamentTeamData && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Player 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Player 2
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-200">
            {tournamentTeamData.map((data: TeamWithPlayers) => (
              <tr key={data.team.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.team.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.player1?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.player2?.name || "N/A"}
                </td>
                <td>
                  <DeleteTeamButton id={data.team.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
