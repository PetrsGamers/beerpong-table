// app/seasons/page.tsx
import { createSeason, deleteSeason, getAllSeasons } from "@/actions/seasons";
import { CrudPage } from "@/components/CrudComponents/CrudPage";

export default function SeasonsPage() {
  return (
    <CrudPage
      title="Seasons"
      fetchData={getAllSeasons}
      columns={[
        { key: "name", label: "Name", required: true, type: "string" },
        {
          key: "createTime",
          label: "created at",
          required: false,
          type: "date",
        },
      ]}
      createAction={async (formData: { name: string }) => {
        "use server";
        await createSeason(formData.name);
      }}
      editAction={async (item) => {
        "use server";
        await getAllSeasons();
      }}
      deleteAction={async (id) => {
        "use server";
        await deleteSeason(id);
      }}
    />
  );
}
