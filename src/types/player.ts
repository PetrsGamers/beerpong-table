export type Player = {
  id: number;
  name: string;
  score: string | null;
  blowjobs: string | null;
};

export type PlayerCouple = {
  player1: Player | null;
  player2: Player | null;
};

export type PlayerStats = {
  id: number;
  name: string | null;
  score: string | null;
  blowjobs: string | null;
};
