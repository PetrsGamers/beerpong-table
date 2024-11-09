import React from "react";

interface MatchWithTeams {
  match: {
    id: string;
    score: string;
  };
  team1: {
    name: string;
  };
  team2: {
    name: string;
  };
}

interface MatchesOverViewTableProps {
  matches: MatchWithTeams[];
}

export const MatchesOverViewTable: React.FC<MatchesOverViewTableProps> = ({
  matches,
}) => {
  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-black">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Team Name
            </th>
          </tr>
        </thead>
        <tbody className="bg-black divide-y divide-gray-200">
          {matches.map((data: MatchWithTeams) => (
            <tr key={data.match.id}>
              <td className="px-6 py-4 whitespace-nowrap">{data.team1.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {data.match.score || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {data.team2.name || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
