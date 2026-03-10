export type MatchWithTeams = {
  match: {
    id: number;
    score: string | null;
    tournament_id: number | null;
    team1_id: number | null;
    team2_id: number | null;
  };
  team1: {
    id: number;
    name: string | null;
    score: string | null;
    player1_id: number | null;
    player2_id: number | null;
    tournament_id: number | null;
  } | null;
  team2: {
    id: number;
    name: string | null;
    score: string | null;
    player1_id: number | null;
    player2_id: number | null;
    tournament_id: number | null;
  } | null;
};
