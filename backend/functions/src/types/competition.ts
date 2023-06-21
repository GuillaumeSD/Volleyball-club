export interface Competition {
  ffvbId: string;
  season: string;
  pool: string;
  name: string;
  url: string;
}

export interface Match {
  ffvbId: string;
  homeTeam: string;
  awayTeam: string;
  matchDate?: string;
  matchTime?: string;
  setsPoint?: string[];
  matchReferee?: string;
  matchFileUrl?: string;
}
