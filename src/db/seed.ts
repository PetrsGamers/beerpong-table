import { db } from "./index";
import {
  season,
  tournament,
  round,
  team,
  player,
  teamPlayer,
  match,
  playerMatchScore,
} from "./schema";
import {
  getTournamentPlayerLeaderboard,
  getSeasonPlayerLeaderboard,
  getTournamentTeamStandings,
  getSeasonTeamStandings,
  getPlayerScoresForMatch,
} from "../actions/stats";

export async function seedV2() {
  console.log("🌱 Starting BeerPong 2.0 seed...");

  // 1. Vyčistit stará testovací data (v kaskádě od sezóny)
  await db.delete(season);

  // 2. Vytvořit Sezónu
  const [s2025] = await db
    .insert(season)
    .values({ name: "Jarní semestr 2025" })
    .returning();
  console.log(`✅ Sezóna vytvořena: "${s2025.name}" (ID: ${s2025.id})`);

  // 3. Vytvořit Turnaj v sezóně
  const [brnoCup] = await db
    .insert(tournament)
    .values({
      name: "Brno Cup 2025",
      seasonId: s2025.id,
    })
    .returning();
  console.log(`✅ Turnaj vytvořen: "${brnoCup.name}" (ID: ${brnoCup.id})`);

  // 4. Vytvořit Kola turnaje
  const [round1] = await db
    .insert(round)
    .values({
      name: "1. kolo (Základní skupina)",
      roundNumber: 1,
      tournamentId: brnoCup.id,
    })
    .returning();

  const [round2] = await db
    .insert(round)
    .values({
      name: "2. kolo (Finále)",
      roundNumber: 2,
      tournamentId: brnoCup.id,
    })
    .returning();
  console.log(`✅ Kola vytvořena: Round 1 (${round1.id}), Round 2 (${round2.id})`);

  // 5. Vytvořit Perzistentní Týmy pro sezónu
  const [teamElita, teamBaroni, teamLuzri] = await db
    .insert(team)
    .values([
      { name: "Elita", seasonId: s2025.id },
      { name: "Pivní baroni", seasonId: s2025.id },
      { name: "Lůzři", seasonId: s2025.id },
    ])
    .returning();
  console.log(
    `✅ Týmy v sezóně vytvořeny: ${teamElita.name}, ${teamBaroni.name}, ${teamLuzri.name}`
  );

  // 6. Vytvořit Perzistentní Hráče v sezóně
  const [pJosef, pPetr, pMartin, pAlex, pTomas] = await db
    .insert(player)
    .values([
      { name: "Josef Skalka", seasonId: s2025.id },
      { name: "Petr Hýbl", seasonId: s2025.id },
      { name: "Martin Tokoš", seasonId: s2025.id },
      { name: "Alexandr Paťava", seasonId: s2025.id },
      { name: "Tomáš Kögler", seasonId: s2025.id },
    ])
    .returning();
  console.log(
    `✅ Hráči v sezóně vytvořeni: Josef Skalka, Petr Hýbl, Martin Tokoš, Alexandr Paťava, Tomáš Kögler`
  );

  // 7. Demonstrace dynamických soupisek (team_player) dle kol:
  // KOLO 1: Josef Skalka hraje za Elitu s Petrem Hýblem!
  await db.insert(teamPlayer).values([
    { roundId: round1.id, teamId: teamElita.id, playerId: pJosef.id },
    { roundId: round1.id, teamId: teamElita.id, playerId: pPetr.id },
    { roundId: round1.id, teamId: teamLuzri.id, playerId: pAlex.id },
    { roundId: round1.id, teamId: teamLuzri.id, playerId: pTomas.id },
  ]);

  // KOLO 2: Josef Skalka přestupuje a hraje za Pivní barony s Martinem Tokošem!
  await db.insert(teamPlayer).values([
    { roundId: round2.id, teamId: teamBaroni.id, playerId: pJosef.id },
    { roundId: round2.id, teamId: teamBaroni.id, playerId: pMartin.id },
    { roundId: round2.id, teamId: teamElita.id, playerId: pPetr.id },
    { roundId: round2.id, teamId: teamElita.id, playerId: pTomas.id },
  ]);
  console.log(
    `✅ Dynamické soupisky: Josef Skalka hraje v 1. kole za Elitu a ve 2. kole za Pivní barony!`
  );

  // 8. Zápas 1 (v Kolo 1): Elita vs Lůzři (10:7)
  const [match1] = await db
    .insert(match)
    .values({
      roundId: round1.id,
      team1Id: teamElita.id,
      team2Id: teamLuzri.id,
      team1Score: 10,
      team2Score: 7,
      status: "completed",
    })
    .returning();

  // Individuální skóre hráčů v Zápase 1:
  await db.insert(playerMatchScore).values([
    {
      matchId: match1.id,
      playerId: pJosef.id,
      teamId: teamElita.id,
      score: 6,
      blowjobs: 2,
    },
    {
      matchId: match1.id,
      playerId: pPetr.id,
      teamId: teamElita.id,
      score: 4,
      blowjobs: 1,
    },
    {
      matchId: match1.id,
      playerId: pAlex.id,
      teamId: teamLuzri.id,
      score: 4,
      blowjobs: 0,
    },
    {
      matchId: match1.id,
      playerId: pTomas.id,
      teamId: teamLuzri.id,
      score: 3,
      blowjobs: 1,
    },
  ]);

  // 9. Zápas 2 (v Kolo 2): Pivní baroni vs Elita (10:8)
  const [match2] = await db
    .insert(match)
    .values({
      roundId: round2.id,
      team1Id: teamBaroni.id,
      team2Id: teamElita.id,
      team1Score: 10,
      team2Score: 8,
      status: "completed",
    })
    .returning();

  // Individuální skóre hráčů v Zápase 2 (Josef hraje za Pivní barony):
  await db.insert(playerMatchScore).values([
    {
      matchId: match2.id,
      playerId: pJosef.id,
      teamId: teamBaroni.id,
      score: 7,
      blowjobs: 3,
    },
    {
      matchId: match2.id,
      playerId: pMartin.id,
      teamId: teamBaroni.id,
      score: 3,
      blowjobs: 0,
    },
    {
      matchId: match2.id,
      playerId: pPetr.id,
      teamId: teamElita.id,
      score: 5,
      blowjobs: 2,
    },
    {
      matchId: match2.id,
      playerId: pTomas.id,
      teamId: teamElita.id,
      score: 3,
      blowjobs: 0,
    },
  ]);

  console.log("✅ Zápasy a hráčská skóre úspěšně vloženy!\n");

  // 10. Otestování všech dotazů (Queries test)
  console.log("--- 📊 TESTOVACÍ VÝPISY QUERIES ---");

  const match1Scores = await getPlayerScoresForMatch(match1.id);
  console.log(
    `1. Skóre hráčů v zápase #${match1.id} (Elita vs Lůzři):`,
    match1Scores.map((s) => `${s.playerName} (${s.teamName}): ${s.score} tref, ${s.blowjobs} BJ`)
  );

  const tournamentLeaderboard = await getTournamentPlayerLeaderboard(brnoCup.id);
  console.log(
    `2. Král střelců a BlowJob King turnaje "${brnoCup.name}":`,
    tournamentLeaderboard.map(
      (p, i) => `${i + 1}. ${p.playerName} - ${p.totalScore} bodů, ${p.totalBlowjobs} BJ (${p.matchesPlayed} zápasů)`
    )
  );

  const seasonLeaderboard = await getSeasonPlayerLeaderboard(s2025.id);
  console.log(
    `3. Král střelců a BlowJob King sezóny "${s2025.name}":`,
    seasonLeaderboard.map(
      (p, i) => `${i + 1}. ${p.playerName} - ${p.totalScore} bodů, ${p.totalBlowjobs} BJ`
    )
  );

  const tournamentStandings = await getTournamentTeamStandings(brnoCup.id);
  console.log(
    `4. Tabulka týmů turnaje "${brnoCup.name}":`,
    tournamentStandings.map(
      (t, i) => `${i + 1}. ${t.teamName} | Zápasy: ${t.played} | V: ${t.wins} R: ${t.draws} P: ${t.losses} | Kelímky: ${t.cupsScored}:${t.cupsConceded} (${t.cupDiff}) | Body: ${t.points}`
    )
  );

  const seasonStandings = await getSeasonTeamStandings(s2025.id);
  console.log(
    `5. Celková tabulka týmů v sezóně "${s2025.name}":`,
    seasonStandings.map(
      (t, i) => `${i + 1}. ${t.teamName} | Body: ${t.points} (${t.cupsScored}:${t.cupsConceded})`
    )
  );

  console.log("\n🎉 Seed & Query ověření dokončeno na 100%!");
}

if (require.main === module) {
  seedV2()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed error:", err);
      process.exit(1);
    });
}
