"use client";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
}

function addNewMatchButton({ id }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/" + id + `/new`);
  };

  return (
    <button onClick={handleClick} className="btn btn-primary">
      Start the tournament
    </button>
  );
}

export default addNewMatchButton;
