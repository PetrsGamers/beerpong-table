"use client";
import { deleteMatch } from "@/actions/matches";
import React from "react";

export interface MatchWithTeams {
  match: {
    id: number;
    score: string | null;
    tournament_id: number | null;
    team1_id: number | null;
    team2_id: number | null;
  };
  team1: {
    id: number;
    name: string | null;
    score: string | null;
    player1_id: number | null;
    player2_id: number | null;
    tournament_id: number | null;
  } | null;
  team2: {
    id: number;
    name: string | null;
    score: string | null;
    player1_id: number | null;
    player2_id: number | null;
    tournament_id: number | null;
  } | null;
}

export interface MatchesOverViewTableProps {
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.match.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {match.team1?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {match.match.score || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {match.team2?.name || "N/A"}
              </td>
              <td className="text-center">
                <button
                  onClick={() => deleteMatch(match.match.id)}
                  className="text-red-600 hover:text-red-900 flex items-center justify-center w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="red"
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
    </>
  );
};
