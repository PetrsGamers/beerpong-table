export type MatchWithTeams = {
  match: {
    id: number;
    score: string;
    tournament_id: number;
    team1_id: number;
    team2_id: number;
  };
  team1: {
    id: number;
    name: string;
    score: string;
    player1_id: number | null;
    player2_id: number | null;
    tournament_id: number;
  } | undefined;
  team2: {
    id: number;
    name: string;
    score: string;
    player1_id: number | null;
    player2_id: number | null;
    tournament_id: number;
  } | undefined;
};
