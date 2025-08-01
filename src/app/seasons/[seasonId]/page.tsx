import Link from "next/link";
import { useParams } from "next/navigation";

export default async function SeasonDetailPage({
  params,
}: {
  params: { seasonId: string };
}) {
  const { seasonId } = params;

  return (
    <>
      <h1>Season Detail Page</h1>
      <div className="flex flex-col gap-4">
        <Link href="/seasons">Back to Seasons</Link>
        <Link href={`/seasons/${seasonId}/tournaments`}>
          Go to Tournaments for this Season
        </Link>
      </div>
      <div className="mt-32">manage teams for season {seasonId} here</div>
    </>
  );
}
