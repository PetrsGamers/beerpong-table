import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './src/db/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('Seeding database...');
  
  // Create Tournament
  const tId = (await db.insert(schema.tournament).values({ name: 'Zimní SPPDF Turnaj 2026' }).returning())[0].id;
  console.log('Tournament created');

  // Create Players
  const p1 = (await db.insert(schema.player).values({ name: 'Petr', score: '35', blowjobs: '2' }).returning())[0].id;
  const p2 = (await db.insert(schema.player).values({ name: 'Honza', score: '28', blowjobs: '0' }).returning())[0].id;
  const p3 = (await db.insert(schema.player).values({ name: 'Tomáš', score: '15', blowjobs: '5' }).returning())[0].id;
  const p4 = (await db.insert(schema.player).values({ name: 'Karel', score: '10', blowjobs: '12' }).returning())[0].id;
  console.log('Players created');

  // Create Teams
  const team1 = (await db.insert(schema.team).values({ name: 'Elita', score: '0', player1_id: p1, player2_id: p2, tournament_id: tId }).returning())[0].id;
  const team2 = (await db.insert(schema.team).values({ name: 'Lůzři', score: '0', player1_id: p3, player2_id: p4, tournament_id: tId }).returning())[0].id;
  console.log('Teams created');

  // Create Matches
  await db.insert(schema.match).values({ tournament_id: tId, team1_id: team1, team2_id: team2, score: '10:6' });
  await db.insert(schema.match).values({ tournament_id: tId, team1_id: team2, team2_id: team1, score: '10:9' });
  console.log('Matches created');

  console.log('Done!');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
