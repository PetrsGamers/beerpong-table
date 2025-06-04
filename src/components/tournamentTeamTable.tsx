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
  const rawTeamData = await loadAllTeams(id.id);
  const tournamentTeamData: TeamData[] = rawTeamData.map((item: any) => ({
    teamId: item.team.id,
    teamName: item.team.name,
    player1Id: item.team.player1_id,
    player1Name: item.player1?.name || null,
    player2Id: item.team.player2_id,
    player2Name: item.player2?.name || null,
  }));
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
                <td>{/* <DeleteButton id={data.team.id} /> */}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="text-right">Počet týmů {tournamentTeamData.length}</div>
    </>
  );
}
