"use client";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
}

function StatsTournamentButton({ id }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/" + id + `/stats`);
  };

  return (
    <button onClick={handleClick} className="btn btn-primary">
      Statistiky turnaje
    </button>
  );
}

export default StatsTournamentButton;
