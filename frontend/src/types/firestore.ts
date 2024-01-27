import { Timestamp } from "firebase/firestore";

export interface Competition {
  ffvbId?: string;
  season?: string;
  pool?: string;
  name?: string;
  url?: string;
  calendarId?: string;
  active?: boolean;
}

export interface Game {
  ffvbId?: string;
  homeTeam?: string;
  awayTeam?: string;
  timestamp?: Timestamp;
  date?: string;
  time?: string;
  setsPoint?: string[];
  referee?: string;
  fileUrl?: string;
  venue?: string;
}

export type WithDocMetaData<T> = T & {
  docId: string;
  collectionParentId?: string;
};
