"use client";

import { createTournament } from "@/app/new/action";
import { useState } from "react";
export default function Home() {
  const [tournamentName, setTournament] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await createTournament(formData);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("Vytvořen nový turnaj");
      setTournament("");
    }
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 items-center sm:items-start max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Nový turnaj</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <label className="form-control w-full">
            <span className="label-text">Turnaj</span>
            <input
              type="text"
              name="tournamentName"
              value={tournamentName}
              onChange={(e) => setTournament(e.target.value)}
              placeholder="Zadejte jméno turnaje"
              className="input input-bordered w-full"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary w-full">
            Vytvořit turnaj
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
