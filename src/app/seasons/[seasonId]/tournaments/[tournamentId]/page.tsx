import Link from "next/link";

export default async function TournamentDetailPage({
  params,
}: {
  params: { seasonId: string; tournamentId: string };
}) {
  const { seasonId, tournamentId } = params;

  return (
    <>
      <h1>Tournament Detail Page</h1>
      <div className="flex flex-col gap-4">
        <Link href={`/seasons/${seasonId}/tournaments`}>
          Back to Tournaments
        </Link>
        <ul>
          <li>
            manage players for tournament {tournamentId} here and assign them to
            teams
          </li>
          <li>Total matches expected and number of played matches</li>
          <li>Go to tournament stats page</li>
          <li>NewMatchButton</li>
          <li>Matches overview table</li>
        </ul>
      </div>
    </>
  );
}
