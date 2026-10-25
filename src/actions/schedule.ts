"use server";

import { db } from "@/db";
import { match, scheduled_match, team } from "@/db/schema";
import { generateSchedule } from "@/lib/schedule";
import { aliasedTable, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getScheduleForTournament = async (tournamentId: number) => {
  const team1 = aliasedTable(team, "team1");
  const team2 = aliasedTable(team, "team2");

  return db
    .select({
      round: scheduled_match.round,
      tableNumber: scheduled_match.table_number,
      team1Id: scheduled_match.team1_id,
      team2Id: scheduled_match.team2_id,
      team1Name: team1.name,
      team2Name: team2.name,
    })
    .from(scheduled_match)
    .leftJoin(team1, eq(scheduled_match.team1_id, team1.id))
    .leftJoin(team2, eq(scheduled_match.team2_id, team2.id))
    .where(eq(scheduled_match.tournament_id, tournamentId))
    .orderBy(asc(scheduled_match.round), asc(scheduled_match.table_number));
};

export type ScheduledMatchWithResult = {
  round: number;
  tableNumber: number;
  team1Id: number;
  team2Id: number;
  team1Name: string;
  team2Name: string;
  // played score oriented like the scheduled match, null if not played yet
  score: string | null;
};

export const getScheduleWithResults = async (
  tournamentId: number
): Promise<ScheduledMatchWithResult[]> => {
  const [schedule, matches] = await Promise.all([
    getScheduleForTournament(tournamentId),
    db.select().from(match).where(eq(match.tournament_id, tournamentId)),
  ]);

  const playedScore = (team1Id: number | null, team2Id: number | null) => {
    for (const m of matches) {
      if (m.team1_id === team1Id && m.team2_id === team2Id) return m.score;
      if (m.team1_id === team2Id && m.team2_id === team1Id) {
        return m.score?.split(":").reverse().join(":") ?? null;
      }
    }
    return null;
  };

  return schedule.map((m) => ({
    round: m.round ?? 0,
    tableNumber: m.tableNumber ?? 0,
    team1Id: m.team1Id ?? 0,
    team2Id: m.team2Id ?? 0,
    team1Name: m.team1Name ?? "",
    team2Name: m.team2Name ?? "",
    score: playedScore(m.team1Id, m.team2Id),
  }));
};

// replaces any existing schedule for the tournament
export const createSchedule = async (tournamentId: number, tables: number) => {
  if (!Number.isInteger(tables) || tables < 1) {
    return { error: "Zadej platný počet stolů" };
  }

  const teams = await db
    .select({ id: team.id })
    .from(team)
    .where(eq(team.tournament_id, tournamentId))
    .orderBy(asc(team.id));
  if (teams.length < 2) {
    return { error: "Turnaj potřebuje alespoň 2 týmy" };
  }

  const schedule = generateSchedule(
    teams.map((t) => t.id),
    tables
  );

  await db.transaction(async (tx) => {
    await tx
      .delete(scheduled_match)
      .where(eq(scheduled_match.tournament_id, tournamentId));
    await tx.insert(scheduled_match).values(
      schedule.map((m) => ({
        tournament_id: tournamentId,
        round: m.round,
        table_number: m.tableNumber,
        team1_id: m.team1Id,
        team2_id: m.team2Id,
      }))
    );
  });

  revalidatePath(`/${tournamentId}`);
  return { success: true };
};

// back to setup; played matches are kept
export const deleteSchedule = async (tournamentId: number) => {
  await db
    .delete(scheduled_match)
    .where(eq(scheduled_match.tournament_id, tournamentId));
  revalidatePath(`/${tournamentId}`);
};
