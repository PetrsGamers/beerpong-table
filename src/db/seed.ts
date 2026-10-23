import { db } from "./index";
import {
  season,
  round,
  team,
  player,
  teamPlayer,
  match,
  playerMatchScore,
} from "./schema";
import {
  getRoundPlayerLeaderboard,
  getRoundTeamStandings,
  getSeasonPlayerLeaderboard,
  getSeasonTeamStandings,
} from "../actions/stats";

export async function seedV2() {
  console.log("🌱 Cleaning existing database tables...");
  // Cascade clean
  await db.delete(playerMatchScore);
  await db.delete(match);
  await db.delete(teamPlayer);
  await db.delete(player);
  await db.delete(team);
  await db.delete(round);
  await db.delete(season);

  console.log("1. Creating Seasons...");
  // 1. Aktivní sezóna (aktuální semestr)
  const [spring2025] = await db
    .insert(season)
    .values({
      name: "Jarní semestr 2025",
      isActive: true,
    })
    .returning();

  // 2. Historická sezóna v archivu
  const [fall2024] = await db
    .insert(season)
    .values({
      name: "Podzimní semestr 2024",
      isActive: false,
    })
    .returning();

  console.log("2. Creating Rounds for Spring 2025 (5 turnajových večerů)...");
  const [r1, r2, r3, r4, r5] = await db
    .insert(round)
    .values([
      {
        name: "1. Kolo",
        roundNumber: 1,
        seasonId: spring2025.id,
        date: new Date("2025-03-05T19:00:00Z"),
        isCompleted: true,
      },
      {
        name: "2. Kolo",
        roundNumber: 2,
        seasonId: spring2025.id,
        date: new Date("2025-03-19T19:00:00Z"),
        isCompleted: true,
      },
      {
        name: "3. Kolo",
        roundNumber: 3,
        seasonId: spring2025.id,
        date: new Date("2025-04-02T19:00:00Z"),
        isCompleted: false,
      },
      {
        name: "4. Kolo",
        roundNumber: 4,
        seasonId: spring2025.id,
        date: new Date("2025-04-16T19:00:00Z"),
        isCompleted: false,
      },
      {
        name: "5. Kolo - Velké Finále",
        roundNumber: 5,
        seasonId: spring2025.id,
        date: new Date("2025-04-30T19:00:00Z"),
        isCompleted: false,
      },
    ])
    .returning();

  // Vytvoříme také 5 kol pro historickou sezónu Podzim 2024
  await db.insert(round).values([
    {
      name: "1. Kolo",
      roundNumber: 1,
      seasonId: fall2024.id,
      date: new Date("2024-10-02T19:00:00Z"),
      isCompleted: true,
    },
    {
      name: "2. Kolo",
      roundNumber: 2,
      seasonId: fall2024.id,
      date: new Date("2024-10-16T19:00:00Z"),
      isCompleted: true,
    },
    {
      name: "3. Kolo",
      roundNumber: 3,
      seasonId: fall2024.id,
      date: new Date("2024-10-30T19:00:00Z"),
      isCompleted: true,
    },
    {
      name: "4. Kolo",
      roundNumber: 4,
      seasonId: fall2024.id,
      date: new Date("2024-11-13T19:00:00Z"),
      isCompleted: true,
    },
    {
      name: "5. Kolo - Velké Finále",
      roundNumber: 5,
      seasonId: fall2024.id,
      date: new Date("2024-11-27T19:00:00Z"),
      isCompleted: true,
    },
  ]);

  console.log("3. Creating Teams for Spring 2025...");
  const [teamBrouci, teamVlci, teamSneci, teamLisky] = await db
    .insert(team)
    .values([
      { name: "Brouci", seasonId: spring2025.id },
      { name: "Vlci", seasonId: spring2025.id },
      { name: "Šneci", seasonId: spring2025.id },
      { name: "Lišky", seasonId: spring2025.id },
    ])
    .returning();

  console.log("4. Creating Players for Spring 2025...");
  const [pJosef, pPetr, pKarel, pJana, pLukas, pTomas] = await db
    .insert(player)
    .values([
      { name: "Josef Skalka", seasonId: spring2025.id },
      { name: "Petr Rychlý", seasonId: spring2025.id },
      { name: "Karel Střelec", seasonId: spring2025.id },
      { name: "Jana Obránkyně", seasonId: spring2025.id },
      { name: "Lukáš Pivo", seasonId: spring2025.id },
      { name: "Tomáš Kelímek", seasonId: spring2025.id },
    ])
    .returning();

  console.log("5. Setting up Round 1 (Večer 1): Rosters & Matches...");
  // Soupisky pro 1. Kolo:
  // Josef Skalka hraje v 1. kole za Brouky!
  await db.insert(teamPlayer).values([
    { roundId: r1.id, teamId: teamBrouci.id, playerId: pJosef.id },
    { roundId: r1.id, teamId: teamBrouci.id, playerId: pPetr.id },
    { roundId: r1.id, teamId: teamVlci.id, playerId: pKarel.id },
    { roundId: r1.id, teamId: teamVlci.id, playerId: pJana.id },
    { roundId: r1.id, teamId: teamSneci.id, playerId: pLukas.id },
    { roundId: r1.id, teamId: teamSneci.id, playerId: pTomas.id },
  ]);

  // Zápas 1 v 1. kole: Brouci vs Vlci (10:7 pro Brouky)
  const [m1] = await db
    .insert(match)
    .values({
      roundId: r1.id,
      team1Id: teamBrouci.id,
      team2Id: teamVlci.id,
      team1Score: 10,
      team2Score: 7,
      status: "completed",
    })
    .returning();

  await db.insert(playerMatchScore).values([
    // Brouci
    {
      matchId: m1.id,
      playerId: pJosef.id,
      teamId: teamBrouci.id,
      score: 6,
      blowjobs: 1,
    },
    {
      matchId: m1.id,
      playerId: pPetr.id,
      teamId: teamBrouci.id,
      score: 4,
      blowjobs: 0,
    },
    // Vlci
    {
      matchId: m1.id,
      playerId: pKarel.id,
      teamId: teamVlci.id,
      score: 5,
      blowjobs: 0,
    },
    {
      matchId: m1.id,
      playerId: pJana.id,
      teamId: teamVlci.id,
      score: 2,
      blowjobs: 2,
    },
  ]);

  // Zápas 2 v 1. kole: Vlci vs Šneci (10:8 pro Vlky)
  const [m2] = await db
    .insert(match)
    .values({
      roundId: r1.id,
      team1Id: teamVlci.id,
      team2Id: teamSneci.id,
      team1Score: 10,
      team2Score: 8,
      status: "completed",
    })
    .returning();

  await db.insert(playerMatchScore).values([
    // Vlci
    {
      matchId: m2.id,
      playerId: pKarel.id,
      teamId: teamVlci.id,
      score: 6,
      blowjobs: 1,
    },
    {
      matchId: m2.id,
      playerId: pJana.id,
      teamId: teamVlci.id,
      score: 4,
      blowjobs: 1,
    },
    // Šneci
    {
      matchId: m2.id,
      playerId: pLukas.id,
      teamId: teamSneci.id,
      score: 5,
      blowjobs: 0,
    },
    {
      matchId: m2.id,
      playerId: pTomas.id,
      teamId: teamSneci.id,
      score: 3,
      blowjobs: 1,
    },
  ]);

  console.log("6. Setting up Round 2 (Večer 2): Player Josef Skalka transfers to Vlci!");
  // Soupisky pro 2. Kolo:
  // Josef Skalka v 2. kole hraje za Vlky!
  await db.insert(teamPlayer).values([
    { roundId: r2.id, teamId: teamBrouci.id, playerId: pPetr.id },
    { roundId: r2.id, teamId: teamBrouci.id, playerId: pLukas.id },
    { roundId: r2.id, teamId: teamVlci.id, playerId: pJosef.id }, // Josef je teď u Vlků
    { roundId: r2.id, teamId: teamVlci.id, playerId: pKarel.id },
    { roundId: r2.id, teamId: teamSneci.id, playerId: pJana.id },
    { roundId: r2.id, teamId: teamSneci.id, playerId: pTomas.id },
  ]);

  // Zápas 3 v 2. kole: Vlci vs Brouci (10:6 pro Vlky díky Josefovi)
  const [m3] = await db
    .insert(match)
    .values({
      roundId: r2.id,
      team1Id: teamVlci.id,
      team2Id: teamBrouci.id,
      team1Score: 10,
      team2Score: 6,
      status: "completed",
    })
    .returning();

  await db.insert(playerMatchScore).values([
    // Vlci
    {
      matchId: m3.id,
      playerId: pJosef.id,
      teamId: teamVlci.id,
      score: 7,
      blowjobs: 2,
    },
    {
      matchId: m3.id,
      playerId: pKarel.id,
      teamId: teamVlci.id,
      score: 3,
      blowjobs: 0,
    },
    // Brouci
    {
      matchId: m3.id,
      playerId: pPetr.id,
      teamId: teamBrouci.id,
      score: 4,
      blowjobs: 1,
    },
    {
      matchId: m3.id,
      playerId: pLukas.id,
      teamId: teamBrouci.id,
      score: 2,
      blowjobs: 0,
    },
  ]);

  console.log("✅ Seed completed successfully!");

  // Verifikace
  console.log("\n--- VERIFIKACE ŽEBŘÍČKŮ ---");
  const round1Leaderboard = await getRoundPlayerLeaderboard(r1.id);
  console.log("Král střelců 1. Kola:", round1Leaderboard.map((p) => `${p.playerName}: ${p.totalScore} kelímků, ${p.totalBlowjobs} blowjobů`));

  const seasonLeaderboard = await getSeasonPlayerLeaderboard(spring2025.id);
  console.log("Král střelců sezóny (Jarní semestr 2025):", seasonLeaderboard.map((p) => `${p.playerName}: ${p.totalScore} kelímků, ${p.totalBlowjobs} blowjobů`));

  const seasonStandings = await getSeasonTeamStandings(spring2025.id);
  console.log("Ligová tabulka sezóny (Jarní semestr 2025):", seasonStandings.map((t) => `${t.teamName}: ${t.points}b, skóre ${t.cupsScored}:${t.cupsConceded}`));
}

if (require.main === module) {
  seedV2()
    .then(() => {
      console.log("All done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
