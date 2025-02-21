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

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Player 1
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                Player 2
              </th>
              <th className="px-6 py-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-200">
            {tournamentTeamData.map((data: TeamData, index) => (
              <tr
                key={data.teamId}
                className={`${
                  index % 2 === 0 ? "bg-black" : "bg-gray-900"
                } hover:bg-gray-700 transition-colors duration-200`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-900">
                  {data.teamName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-900">
                  {data.player1Name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-900">
                  {data.player2Name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <DeleteTeamButton id={data.teamId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-right mt-4 text-sm text-gray-100">
        Počet týmů {tournamentTeamData.length}
      </div>
    </>
  );
}
