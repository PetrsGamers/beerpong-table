// app/seasons/page.tsx
import {
  createSeason,
  deleteSeason,
  getAllSeasons,
  updateSeason,
} from "@/actions/seasons";
import { CrudPage } from "@/components/CrudComponents/CrudPage";
import { Season } from "@/db/types";

export default function SeasonsPage() {
  return (
    <CrudPage<Season>
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
          key: "createdAt",
          label: "Created at",
          required: false,
          type: "date",
        },
      ]}
      createAction={async (item) => {
        "use server";
        if (item.name) {
          await createSeason({ name: item.name });
        }
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
