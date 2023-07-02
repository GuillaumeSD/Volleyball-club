import { GameEvent } from "@/types/calendar";
import { Competition } from "@/types/firestore";
import { Dayjs } from "dayjs";

export type GameEventWithTime = GameEvent & { dayjs: Dayjs };

export const sortGameEvents =
  (games: GameEventWithTime[]) =>
  (gameA: GameEventWithTime, gameB: GameEventWithTime): number => {
    const [aTime, bTime] = [gameA, gameB].map((game) => {
      if (game.dayjs.hour() === 0) {
        const sameCompetitionGame = games.find(
          isSameCompetitionGame(game.competition)
        );
        if (sameCompetitionGame) {
          return sameCompetitionGame.dayjs.add(1, "minute");
        }
      }
      return game.dayjs;
    });

    const timeDiff = aTime.diff(bTime, "minute");

    if (timeDiff > 10) return 1;
    if (timeDiff < -10) return -1;

    if (!gameA.competition?.name || !gameB.competition?.name) return 0;

    if (gameA.competition.name === gameB.competition.name) {
      return aTime.isAfter(bTime) ? 1 : -1;
    }

    return gameA.competition.name > gameB.competition.name ? 1 : -1;
  };

const isSameCompetitionGame =
  (competition?: Competition) =>
  (game: GameEvent): boolean =>
    game.competition?.name === competition?.name && game.dayjs?.hour() !== 0;

export const isGameSameDay =
  (date: Dayjs) =>
  (game: GameEvent): game is GameEventWithTime =>
    game.dayjs?.isSame(date, "day") === true;
