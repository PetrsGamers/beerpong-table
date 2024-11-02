"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface TournamentDetailsButtonProps {
  id: number;
}

const TournamentDetailsButton: React.FC<TournamentDetailsButtonProps> = ({
  id,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${id}`);
  };

  return (
    <button onClick={handleClick} className="btn btn-primary">
      Detaily
    </button>
  );
};

export default TournamentDetailsButton;
