"use client";
import { deleteMatch } from "@/actions/matches";
import { MatchWithTeams } from "@/app/[tournamentid]/action";

export interface MatchesOverViewTableProps {
  matches: MatchWithTeams[];
}

export const MatchesOverViewTable: React.FC<MatchesOverViewTableProps> = ({
  matches,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-black">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-4 w-20"></th>
          </tr>
        </thead>
        <tbody className="bg-black divide-y divide-gray-200">
          {matches.map((match, index) => (
            <tr
              key={match.match.id}
              className={`${
                index % 2 === 0 ? "bg-black" : "bg-gray-900"
              } hover:bg-gray-700 transition-colors duration-200`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-900">
                {match.team1?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white-600 font-semibold">
                {match.match.score || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-900">
                {match.team2?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onClick={() => deleteMatch(match.match.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.364 5.636a1 1 0 010 1.414L13.414 12l4.95 4.95a1 1 0 11-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 01-1.414-1.414L10.586 12 5.636 7.05a1 1 0 111.414-1.414L12 10.586l4.95-4.95a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
