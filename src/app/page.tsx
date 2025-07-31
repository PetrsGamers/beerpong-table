// app/seasons/page.tsx
import { getAllSeasons } from "@/actions/seasons";
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
      deleteAction={async (id) => {
        "use server";
        await getAllSeasons();
      }}
    />
  );
}
