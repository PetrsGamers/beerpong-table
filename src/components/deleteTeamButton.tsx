//WIP
"use client";

import { deleteTeam } from "@/actions/teams";

import React from "react";

interface DeleteTeamButtonProps {
  id: number;
}

const DeleteTeamButton: React.FC<DeleteTeamButtonProps> = ({ id }) => {
  return (
    <button onClick={() => deleteTeam(id)}>
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
  );
};

export default DeleteTeamButton;
