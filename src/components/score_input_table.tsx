"use client";
import { createNewMatch } from "@/actions/matches";
import { getPlayersForTeamId } from "@/actions/players";
import { useToast } from "@/hooks/use-toast";
import { PlayerCouple } from "@/types/player";
import { Team } from "@/types/team";
import { useState } from "react";
import { TableInput } from "./table_input";

export const ScoreInputTable = (props: {
  teams: Team[];
  tournamentId: number;
}) => {
  const defaultPlayerState = {
    player1: null,
    player2: null,
  };

  const { toast } = useToast();

  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [team1Players, setTeam1Players] =
    useState<PlayerCouple>(defaultPlayerState);
  const [team2Players, setTeam2Players] =
    useState<PlayerCouple>(defaultPlayerState);

  const fetchPlayers = async (teamId: number) => {
    const players = await getPlayersForTeamId(teamId);
    return players;
  };

  // Handle team selection change
  const onSelectChange = async (
    teamSetter: any,
    playerSetter: any,
    selectedTeamId: any
  ) => {
    const selectedTeam = props.teams.find(
      (team) => team.id === parseInt(selectedTeamId)
    );
    teamSetter(selectedTeam);

    if (selectedTeam) {
      const players = await fetchPlayers(selectedTeam.id);
      console.log(players);
      playerSetter(players);
    }
    if (!selectedTeam) {
      playerSetter(defaultPlayerState);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.target);

    // Extract form data
    const values = Object.fromEntries(formData.entries());
    console.log(values); // Use form data as needed

    // TODO: check values for empty or wrong values
    if (!team1?.id || !team2?.id) {
      toast({
        title: "Error submitting match",
        description: "Team not selected",
      });
      return;
    }

    // create a match entry in the db

    await createNewMatch(props.tournamentId, team1?.id, team2?.id);

    // create 4 match-player entries in the db

    // show success / error toast message
    toast({
      title: "Match saved successfully",
      description: "Dobrá práce, kámobráško",
    });

    // refresh the page
  };

  return (
    <div className="overflow-x-auto">
      <div>{JSON.stringify(props.teams)}</div>
      <form onSubmit={handleSubmit}>
        <table className="min-w-full border-collapse table-auto text-center">
          <thead className="bg-gray-800">
            <tr>
              <th colSpan={2} className="py-2 px-4 border-b">
                Tým 1:
                <select
                  onChange={(e) => {
                    console.log("changed, yo:", e.target.value);
                    onSelectChange(setTeam1, setTeam1Players, e.target.value);
                  }}
                  value={team1?.id || "No team selected"}
                >
                  <option>No team selected</option>
                  {props.teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </th>
              <th colSpan={2} className="py-2 px-4 border-b">
                Skóre
              </th>
              <th colSpan={2} className="py-2 px-4 border-b">
                Tým 2:
                <select
                  onChange={(e) => {
                    console.log("changed, yo:", e.target.value);
                    onSelectChange(setTeam2, setTeam2Players, e.target.value);
                  }}
                  value={team2?.id || "No team selected"}
                >
                  <option>No team selected</option>
                  {props.teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-4 border-b text-nowrap">Hráč 1</td>
              <td className="py-2 px-4 border-b">BJ</td>
              <td colSpan={2} className="py-2 px-4 border-b">
                Body
              </td>
              <td className="py-2 px-4 border-b">BJ</td>
              <td className="py-2 px-4 border-b text-nowrap">Hráč 1</td>
            </tr>
            <tr className="bg-gray-400">
              <td className="py-2 px-4 border-b">
                {team1Players.player1?.name}
              </td>
              <TableInput name="team1player1BJ" />
              <TableInput name="team1player1score" />
              <TableInput name="team2player1score" />
              <TableInput name="team2player1BJ" />
              <td className="py-2 px-4 border-b">
                {team2Players.player1?.name}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-nowrap">Hráč 2</td>
              <td className="py-2 px-4 border-b"></td>
              <td colSpan={2} className="py-2 px-4 border-b">
                Body
              </td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b text-nowrap">Hráč 2</td>
            </tr>
            <tr className="bg-gray-400">
              <td className="py-2 px-4 border-b">
                {team1Players.player2?.name}
              </td>
              <TableInput name="team1player2BJ" />
              <TableInput name="team1player2score" />
              <TableInput name="team2player2score" />
              <TableInput name="team2player2BJ" />
              <td className="py-2 px-4 border-b">
                {team2Players.player2?.name}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end w-full">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            onClick={() =>
              toast({
                title: "sup, bitch",
              })
            }
          >
            show toast
          </button>
        </div>
      </form>
    </div>
  );
};
