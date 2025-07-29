"use server";

import { getAllSeasons } from "@/actions/seasons";

export default async function Home() {
  const seasons = await getAllSeasons();
  return (
    <div className="h-full">
      <h1>Seasons</h1>
      {seasons.map((s) => (
        <a href={`/season/${s.id}`}>{s.name}</a>
      ))}
    </div>
  );
}
