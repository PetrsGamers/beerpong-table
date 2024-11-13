"use server";
import { loadAllTeams } from "@/actions/teams";
import DeleteTeamButton from "@/components/deleteTeamButton";

interface TeamData {
  teamId: number;
  teamName: string | null;
  player1Id: number | null;
  player1Name: string | null;
  player2Id: number | null;
  player2Name: string | null;
}

export default async function TournamentTeamTable(id: { id: number }) {
  const tournamentTeamData: TeamData[] = await loadAllTeams(id.id);
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
            {tournamentTeamData.map((data: TeamData) => (
              <tr key={data.teamId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.teamName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.player1Name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {data.player2Name || "N/A"}
                </td>
                <td>
                  <DeleteTeamButton id={data.teamId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="text-right">Počet týmů {tournamentTeamData.length}</div>
    </>
  );
}
