"use client";

import { deleteTeam } from "@/actions/teams";

export const DeleteButton = ({ id }: any) => {
  return (
    <button className="btn btn-error" onClick={() => deleteTeam(id)}>
      Delete
    </button>
  );
};
