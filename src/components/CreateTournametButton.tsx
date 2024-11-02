"use client";
import { useRouter } from "next/navigation";

function createTournamentButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/new`);
  };

  return (
    <button onClick={handleClick} className="btn btn-primary">
      Create New Tournament
    </button>
  );
}

export default createTournamentButton;
