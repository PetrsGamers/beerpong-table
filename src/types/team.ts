export type Team = {
  id: number;
  name: string | null;
  score: string | null;
  player1_id: number | null;
  player2_id: number | null;
  tournament_id: number | null;
};

export type TeamStats = {
  id: number;
  score: number;
  name: string;
};
