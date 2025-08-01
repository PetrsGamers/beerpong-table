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
  return (
    <CrudPage
      title="Seasons"
      fetchData={getAllSeasons}
      columns={[
        {
          key: "name",
          label: "Name",
          required: true,
          type: "string",
          link: "/seasons/[id]",
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
