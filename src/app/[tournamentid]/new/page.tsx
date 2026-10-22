import { getTournamentById } from "@/actions/tournaments";
import { redirect } from "next/navigation";

export default async function LegacyNewMatchRedirect({
  params,
}: {
  params: { tournamentid: string };
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
