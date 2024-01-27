import { Timestamp } from "firebase-admin/firestore";

export type CompetitionMetadataDto = {
  ffvbId: string;
  season: string;
  pool: string;
  name: string;
  url: string;
  calendarId?: string;
  active?: boolean;
};

export type GameDto = {
  ffvbId: string;
  homeTeam: string;
  awayTeam: string;
  timestamp?: Timestamp;
  date?: string;
  time?: string;
  venue?: string;
  setsPoint?: string[];
  referee?: string;
  fileUrl?: string;
};

export type CompetitionDto = {
  metadata: CompetitionMetadataDto;
  games: GameDto[];
};
