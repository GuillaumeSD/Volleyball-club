export interface Competition {
  name?: string;
}

export interface Match {
  ffvbId?: string;
  homeTeam?: string;
  awayTeam?: string;
  matchDate?: string;
  matchTime?: string;
  setsPoint?: string[];
  matchReferee?: string;
  matchFileUrl?: string;
}
