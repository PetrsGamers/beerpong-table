"use client";

import { deleteSeason } from "@/actions/seasons";

export default function DeleteSeasonButton({ id }: { id: number }) {
  return <button onClick={() => deleteSeason(id)}>X</button>;
}
