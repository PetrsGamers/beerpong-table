"use client";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  matches?: any[]; // Add matches prop to check if any exist
}

function AddNewMatchButton({ id, matches }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/" + id + `/new`);
  };

  return (
    <button onClick={handleClick} className="btn btn-primary">
      {matches && matches.length > 0 ? "Add match" : "Start the tournament"}
    </button>
  );
}

export default AddNewMatchButton;
