"use server";

import { db } from "@/db";
import { match, player, player_match_score } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PlayerMatchPoints = {
  playerId: number;
  score: number;
  blowjobs: number;
};

// saves the match together with each player's points, all or nothing
export const createNewMatch = async (
  tournamentId: number,
  team1Id: number,
  team2Id: number,
  score: string,
  playerPoints: PlayerMatchPoints[]
) => {
  // single round robin: each pair of teams plays only once per tournament
  const existing = await db
    .select({ id: match.id })
    .from(match)
    .where(
      and(
        eq(match.tournament_id, tournamentId),
        or(
          and(eq(match.team1_id, team1Id), eq(match.team2_id, team2Id)),
          and(eq(match.team1_id, team2Id), eq(match.team2_id, team1Id))
        )
      )
    );
  if (existing.length !== 0) {
    return { error: "These teams have already played each other" };
  }

  await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(match)
      .values({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        score,
      })
      .returning({ id: match.id });

    // kept per match so deleting the match can take the points back
    await tx.insert(player_match_score).values(
      playerPoints.map((p) => ({
        player_id: p.playerId,
        match_id: created.id,
        score: String(p.score),
        blowjobs: String(p.blowjobs),
      }))
    );
    for (const p of playerPoints) {
      await tx
        .update(player)
        .set({
          score: sql`coalesce(${player.score}, 0) + ${p.score}`,
          blowjobs: sql`coalesce(${player.blowjobs}, 0) + ${p.blowjobs}`,
        })
        .where(eq(player.id, p.playerId));
    }
  });
  revalidatePath(`/${tournamentId}`);
  return { success: true };
};

export const getMatchesForTournament = async (tournamentId: number) => {
  const matches = await db
    .select()
    .from(match)
    .where(eq(match.tournament_id, tournamentId));
  return matches;
};

// also takes back the points players earned in the match
export const deleteMatch = async (id: number) => {
  const tournament_id = await db.transaction(async (tx) => {
    const points = await tx
      .delete(player_match_score)
      .where(eq(player_match_score.match_id, id))
      .returning();
    for (const p of points) {
      await tx
        .update(player)
        .set({
          score: sql`coalesce(${player.score}, 0) - ${p.score ?? 0}`,
          blowjobs: sql`coalesce(${player.blowjobs}, 0) - ${p.blowjobs ?? 0}`,
        })
        .where(eq(player.id, p.player_id!));
    }
    return tx
      .delete(match)
      .where(eq(match.id, id))
      .returning({ deletedId: match.tournament_id });
  });
  redirect("/" + tournament_id[0].deletedId);
};
