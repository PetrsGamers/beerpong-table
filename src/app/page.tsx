// app/seasons/page.tsx
import { deleteSeason, getAllSeasons } from "@/actions/seasons";
import { CrudPage } from "@/components/CrudPage";

export default function SeasonsPage() {
  return (
    <CrudPage
      title="Seasons"
      fetchData={getAllSeasons}
      columns={[
        { key: "name", label: "Name" },
        { key: "createTime", label: "created at" },
      ]}
      createAction={async () => {
        "use server";
        await getAllSeasons();
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
