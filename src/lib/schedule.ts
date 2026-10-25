export type ScheduledPairing = {
  round: number;
  tableNumber: number;
  team1Id: number;
  team2Id: number;
};

// Single round robin via the circle method: one team stays fixed while the
// others rotate, which gives every pair exactly once over n - 1 rounds.
function circleRounds(teamIds: number[]): [number, number][][] {
  const slots: (number | null)[] = [...teamIds];
  if (slots.length % 2 === 1) slots.push(null); // bye

  const n = slots.length;
  const rounds: [number, number][][] = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs: [number, number][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = slots[i];
      const b = slots[n - 1 - i];
      if (a === null || b === null) continue;
      // alternate sides so the fixed team isn't always team 1
      pairs.push(r % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(pairs);
    slots.splice(1, 0, slots.pop()!);
  }
  return rounds;
}

// Packs the round-robin matches into rounds of at most `tables` matches,
// with no team playing twice in the same round.
export function generateSchedule(
  teamIds: number[],
  tables: number
): ScheduledPairing[] {
  const remaining = circleRounds(teamIds).flat();
  const schedule: ScheduledPairing[] = [];

  let round = 1;
  while (remaining.length > 0) {
    const busy = new Set<number>();
    let tableNumber = 1;
    for (let i = 0; i < remaining.length && tableNumber <= tables;) {
      const [team1Id, team2Id] = remaining[i];
      if (busy.has(team1Id) || busy.has(team2Id)) {
        i++;
        continue;
      }
      busy.add(team1Id);
      busy.add(team2Id);
      schedule.push({ round, tableNumber, team1Id, team2Id });
      tableNumber++;
      remaining.splice(i, 1);
    }
    round++;
  }
  return schedule;
}
