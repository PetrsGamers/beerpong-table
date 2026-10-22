import { getTournamentById } from "@/actions/tournaments";
import { redirect } from "next/navigation";

export default async function LegacyMatchRedirect({
  params,
}: {
  params: { tournamentid: string; matchid: string };
}) {
  const tournamentId = Number(params.tournamentid);
  if (!isNaN(tournamentId)) {
    const t = await getTournamentById(tournamentId);
    if (t?.seasonId) {
      redirect(`/seasons/${t.seasonId}/tournaments/${tournamentId}`);
    }
  }
  redirect("/tournaments");
}
