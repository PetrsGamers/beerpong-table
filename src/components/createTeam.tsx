"use client";

import { createTeam, findTeamCount } from "@/app/[tournamentid]/action";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function CreateTeam(id: { id: number }) {
  const [teamName, setTeamName] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [message, setMessage] = useState("");
  const [teamCount, setTeamCount] = useState(0); ///TODO: implement findTeamCount

  useEffect(() => {
    const updateTeamCount = async () => {
      const updatedTeamCount = await findTeamCount(id.id);
      setTeamCount(updatedTeamCount);
    };

    updateTeamCount();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("tournamentId", id.id.toString());
    const result = await createTeam(formData);
    const teamCount = await findTeamCount(id.id);
    if (result.error) {
      setMessage(result.error);
      toast({
        title: "Jujky chyba",
        description: result.error,
        duration: 2000,
        color: "red",
      });
    } else if (result.success) {
      setMessage(result.success);
      toast({
        title: "Team " + teamName + " created successfully",
        description: "Dobrá práce, kámobráško",
        duration: 2000,
        color: "green",
      });
      setTeamName("");
      setPlayer1("");
      setPlayer2("");
      setTeamCount(teamCount);
    }
  }

  return (
    <div className="p-8 pb-20 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 items-center sm:items-start max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Zadej jméno týmu</h1>
        <p className="text-center">Počet týmů: {teamCount}</p>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <label className="form-control w-full">
            <span className="label-text">Tým</span>
            <input
              type="text"
              name="team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Zadejte jméno týmu"
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">Hráč 1</span>
            <input
              type="text"
              name="player1"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              placeholder="Zadejte jméno prvního hráče"
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">Hráč 2</span>
            <input
              type="text"
              name="player2"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              placeholder="Zadejte jméno druhého hráče"
              className="input input-bordered w-full"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">
            Vytvořit tým
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              typeof message === "string" &&
              message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
