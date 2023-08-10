import { Timestamp } from "firebase-admin/firestore";

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
  timestamp?: Timestamp;
  date?: string;
  time?: string;
  venue?: string;
  setsPoint?: string[];
  referee?: string;
  fileUrl?: string;
}
