import { faker } from "@faker-js/faker";
import {
  player,
  team,
  season,
  tournament,
  teamTournament,
  playerTournament,
  match,
  teamMatchScore,
  score,
} from "../db/schema";
import { db } from ".";

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Players
  const players = Array.from({ length: 10 }, () => ({
    name: faker.person.firstName(),
  }));
  const insertedPlayers = await db.insert(player).values(players).returning();

  // 2. Teams
  const teams = Array.from({ length: 4 }, () => ({
    name: faker.company.name(),
  }));
  const insertedTeams = await db.insert(team).values(teams).returning();

  // 3. Season
  const [insertedSeason] = await db
    .insert(season)
    .values({
      name: "Spring " + new Date().getFullYear(),
    })
    .returning();

  // 4. Tournament
  const [insertedTournament] = await db
    .insert(tournament)
    .values({
      name: "Championship Cup",
      seasonId: insertedSeason.id,
    })
    .returning();

  // 5. TeamTournament
  const teamTournamentEntries = insertedTeams.map((team) => ({
    teamId: team.id,
    tournamentId: insertedTournament.id,
  }));
  const insertedTeamTournaments = await db
    .insert(teamTournament)
    .values(teamTournamentEntries)
    .returning();

  // 6. PlayerTournament
  const playerTournamentEntries = insertedPlayers.map((player) => ({
    playerId: player.id,
    teamTournamentId: faker.helpers.arrayElement(insertedTeamTournaments).id,
  }));
  await db.insert(playerTournament).values(playerTournamentEntries);

  // 7. Matches
  const matches = Array.from({ length: 3 }, (_, i) => ({
    roundNumber: i + 1,
    tournamentId: insertedTournament.id,
  }));
  const insertedMatches = await db.insert(match).values(matches).returning();

  // 8. TeamMatchScores
  for (const matchItem of insertedMatches) {
    const [team1, team2] = faker.helpers.shuffle(insertedTeams).slice(0, 2);
    await db.insert(teamMatchScore).values({
      matchId: matchItem.id,
      team1Id: team1.id,
      team2Id: team2.id,
      scoreTeam1: faker.number.int({ min: 10, max: 30 }),
      scoreTeam2: faker.number.int({ min: 10, max: 30 }),
    });
  }

  // 9. Player Scores
  for (const matchItem of insertedMatches) {
    const matchPlayers = faker.helpers.shuffle(insertedPlayers).slice(0, 4);
    const playerScores = matchPlayers.map((p) => ({
      playerId: p.id,
      matchId: matchItem.id,
      score: faker.number.int({ min: 0, max: 10 }),
      bonusScore: faker.number.int({ min: 0, max: 5 }),
    }));
    await db.insert(score).values(playerScores);
  }

  console.log("✅ Seed complete");
}

seed().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
