"use server";

export type MatchWithTeams = {
  match: {
    id: number;
    team1_id?: number | null;
    team2_id?: number | null;
    round_id?: number | null;
    score?: string | null;
  };
  team1: {
    id: number;
    name: string | null;
  } | null;
  team2: {
    id: number;
    name: string | null;
  } | null;
};

export async function createTeam(data: any): Promise<{ error?: string | null; success?: boolean }> {
  return { error: null, success: true };
}

export async function loadMatches(id: number) {
  return null;
}

export async function loadTournament(id: number) {
  return null;
}
