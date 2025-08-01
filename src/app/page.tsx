// app/seasons/page.tsx
import {
  createSeason,
  deleteSeason,
  getAllSeasons,
  updateSeason,
} from "@/actions/seasons";
import { CrudPage } from "@/components/CrudComponents/CrudPage";
import { NewSeason } from "@/db/types";

export default function SeasonsPage() {
  return <div>Some dashboard here, idk</div>;
}
