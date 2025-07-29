"use server";

import { getAllSeasons } from "@/actions/seasons";
import DeleteSeasonButton from "@/components/deleteSeasonButton";

export default async function Home() {
  const seasons = await getAllSeasons();
  return (
    <div className="h-full">
      <h1>Seasons</h1>
      {seasons.map((s) => (
        <div key={s.id} className="flex gap-8">
          <a href={`/season/${s.id}`}>{s.name}</a>
          <p>{String(s.createTime.toLocaleString())}</p>
          <DeleteSeasonButton id={s.id} />
        </div>
      ))}
    </div>
  );
}
