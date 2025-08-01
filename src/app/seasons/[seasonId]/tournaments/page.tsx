// app/seasons/page.tsx
import {
  createSeason,
  deleteSeason,
  getAllSeasons,
  updateSeason,
} from "@/actions/seasons";
import { getAllTournaments } from "@/actions/tournaments";
import { CrudPage } from "@/components/CrudComponents/CrudPage";
import { NewSeason } from "@/db/types";

export default function TournamentsPage() {
  return (
    <CrudPage
      title="Tournaments"
      fetchData={getAllTournaments}
      columns={[
        {
          key: "name",
          label: "Name",
          required: true,
          type: "string",
          link: "/seasons/[seasonId]/tournaments/[tournamentId]",
        },
        {
          key: "createTime",
          label: "created at",
          required: false,
          type: "date",
        },
      ]}
      createAction={async (season: NewSeason) => {
        "use server";
        await createSeason(season);
      }}
      editAction={async (item) => {
        "use server";
        await updateSeason(item.id, item);
      }}
      deleteAction={async (id) => {
        "use server";
        await deleteSeason(id);
      }}
    />
  );
}
