import { Dayjs } from "dayjs";
import { Competition, Game } from "./firestore";

export type GameEvent = Game & {
  competition?: Competition;
  dayjs?: Dayjs;
};
