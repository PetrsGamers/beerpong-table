import {
  createTournament,
  deleteTournament,
  getTournamentsForSeason,
  updateTournament,
} from "@/actions/tournaments";
import { CrudPage } from "@/components/CrudComponents/CrudPage";
import { Tournament } from "@/db/types";

export default function TournamentsPage({
  params,
}: {
  params: { seasonId: string };
}) {
  const seasonId = Number(params.seasonId);

  return (
    <CrudPage<Tournament>
      title="Turnaje sezóny"
      fetchData={() => getTournamentsForSeason(seasonId)}
      columns={[
        {
          key: "name",
          label: "Název turnaje",
          required: true,
          type: "string",
          link: `/seasons/${seasonId}/tournaments/[id]`,
        },
        {
          key: "createdAt",
          label: "Vytvořeno",
          required: false,
          type: "date",
        },
      ]}
      createAction={async (item) => {
        "use server";
        if (item.name) {
          await createTournament({ name: item.name, seasonId });
        }
      }}
      editAction={async (item) => {
        "use server";
        await updateTournament(item.id, item);
      }}
      deleteAction={async (id) => {
        "use server";
        await deleteTournament(id);
      }}
    />
  );
}
