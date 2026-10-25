"use client";
import { createNewMatch } from "@/actions/matches";
import { getPlayersForTeamId } from "@/actions/players";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown } from "lucide-react";
import { PlayerCouple } from "@/types/player";
import { Team } from "@/types/team";
import { useRef, useState } from "react";
import { SubmitDialog } from "./submit_dialog";
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

  const formRef = useRef(null);
  // ref guards against double submits within the same tick, state drives the UI
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
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

  const swapPlayers = (playerSetter: any) => {
    playerSetter((players: PlayerCouple) => ({
      player1: players.player2,
      player2: players.player1,
    }));
  };

  function handleModalConfirm() {
    if (formRef?.current) {
      //@ts-ignore
      formRef.current.requestSubmit();
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent page reload
    if (savingRef.current) {
      return;
    }
    const formData = new FormData(event.target);

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

    if (team1?.id == team2?.id) {
      toast({
        title: "Error submitting match",
        description: "Select two distinct teams",
        duration: 2000,
      });
      return;
    }

    // players are read from state (not the team) so a swapped order is respected
    if (
      !team1Players.player1 ||
      !team1Players.player2 ||
      !team2Players.player1 ||
      !team2Players.player2
    ) {
      toast({
        title: "Error submitting match",
        description: "Players not loaded",
        duration: 2000,
      });
      return;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      // create a match entry in the db
      const t1score =
        Number(values.team1player1score) + Number(values.team1player2score);
      const t2score =
        Number(values.team2player1score) + Number(values.team2player2score);

      const result = await createNewMatch(
        props.tournamentId,
        team1?.id,
        team2?.id,
        `${t1score}:${t2score}`,
        [
          {
            playerId: team1Players.player1.id,
            score: Number(values.team1player1score),
            blowjobs: Number(values.team1player1BJ),
          },
          {
            playerId: team1Players.player2.id,
            score: Number(values.team1player2score),
            blowjobs: Number(values.team1player2BJ),
          },
          {
            playerId: team2Players.player1.id,
            score: Number(values.team2player1score),
            blowjobs: Number(values.team2player1BJ),
          },
          {
            playerId: team2Players.player2.id,
            score: Number(values.team2player2score),
            blowjobs: Number(values.team2player2BJ),
          },
        ]
      );
      if (result.error) {
        toast({
          title: "Error submitting match",
          description: result.error,
          duration: 2000,
        });
        return;
      }

      //
      // TODO: huge refactoring needed
      //

      // await createPlayerMatchEntry(
      //   team1.player1_id,
      //   MATCHID,
      //   formData.get("team1player1score") || 0,
      //   formData.get("team1player1BJ") || 0
      //

      // create 4 match-player entries in the db

      // show success / error toast message
      toast({
        title: "Match saved successfully",
        description: "Dobrá práce, kámobráško",
        duration: 2000,
      });

      // reset the form values to default
      event.target.reset();
      // clear the teams too, so the same match can't be submitted again by accident
      setTeam1(null);
      setTeam2(null);
      setTeam1Players(defaultPlayerState);
      setTeam2Players(defaultPlayerState);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* <div>{JSON.stringify(props.teams)}</div> */}
      <form ref={formRef} onSubmit={handleSubmit}>
        <table className="min-w-full border-collapse table-auto text-center">
          <thead className="bg-gray-800">
            <tr>
              <th colSpan={2} className="py-2 px-4 border-b">
                Tým 1: &nbsp;:
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
                <button
                  type="button"
                  className="btn btn-sm btn-ghost ml-1"
                  title="Prohodit hráče"
                  onClick={() => swapPlayers(setTeam1Players)}
                  disabled={!team1Players.player1}
                >
                  <ArrowUpDown size={16} />
                </button>
              </th>
              <th colSpan={2} className="py-2 px-4 border-b">
                Skóre
              </th>
              <th colSpan={2} className="py-2 px-4 border-b">
                Tým 2: &nbsp;
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
                <button
                  type="button"
                  className="btn btn-sm btn-ghost ml-1"
                  title="Prohodit hráče"
                  onClick={() => swapPlayers(setTeam2Players)}
                  disabled={!team2Players.player1}
                >
                  <ArrowUpDown size={16} />
                </button>
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
            <tr className="bg-gray-300">
              <td className="py-2 px-4 border-b text-black font-bold">
                {team1Players.player1?.name}
              </td>
              <TableInput name="team1player1BJ" />
              <TableInput name="team1player1score" />
              <TableInput name="team2player1score" />
              <TableInput name="team2player1BJ" />
              <td className="py-2 px-4 border-b text-black font-bold">
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
            <tr className="bg-gray-300 text-white">
              <td className="py-2 px-4 border-b text-black font-bold ">
                {team1Players.player2?.name}
              </td>
              <TableInput name="team1player2BJ" />
              <TableInput name="team1player2score" />
              <TableInput name="team2player2score" />
              <TableInput name="team2player2BJ" />
              <td className="py-2 px-4 border-b text-black font-bold">
                {team2Players.player2?.name}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end w-full mt-2">
          <SubmitDialog
            handleModalConfirm={handleModalConfirm}
            disabled={saving}
            description={`Team ${team1?.name} : Team ${team2?.name}`}
          />
        </div>
      </form>
    </div>
  );
};
