export type Player = {
  id: number;
  name: string;
  score: number;
  blowjobs: number;
};

export type PlayerCouple = {
  player1: Player | null;
  player2: Player | null;
};
