"use client";
import { createSchedule } from "@/actions/schedule";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { pluralCs } from "@/lib/utils";
import { useState } from "react";

type Props = {
  tournamentId: number;
  defaultTables: number;
  // an existing schedule is replaced only after confirmation
  hasSchedule: boolean;
  disabled?: boolean;
};

export const ScheduleGenerateForm = ({
  tournamentId,
  defaultTables,
  hasSchedule,
  disabled,
}: Props) => {
  const { toast } = useToast();
  const [tables, setTables] = useState(String(defaultTables));
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await createSchedule(tournamentId, Number(tables));
      if (result.error) {
        toast({ title: "Rozpis nevygenerován", description: result.error });
      }
    } finally {
      setGenerating(false);
    }
  };

  const generateButton = (
    <button
      className={hasSchedule ? "btn btn-ghost" : "btn btn-primary"}
      disabled={generating || disabled}
      onClick={hasSchedule ? undefined : handleGenerate}
    >
      {generating
        ? "Generuji..."
        : hasSchedule
          ? "Přegenerovat rozpis"
          : "Vygenerovat rozpis"}
    </button>
  );

  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1 text-sm text-gray-400">
        Počet stolů
        <input
          type="number"
          min={1}
          value={tables}
          onChange={(e) => setTables(e.target.value)}
          className="w-28 p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      {hasSchedule ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>{generateButton}</AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader className="bg-white">
              <AlertDialogTitle className="text-black font-bold">
                Přegenerovat rozpis?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Současný rozpis bude nahrazen novým pro{" "}
                {pluralCs(Number(tables), "stůl", "stoly", "stolů")}. Odehrané
                zápasy zůstanou zachovány.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn btn-secondary">
                Zrušit
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerate}>
                Přegenerovat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        generateButton
      )}
    </div>
  );
};
