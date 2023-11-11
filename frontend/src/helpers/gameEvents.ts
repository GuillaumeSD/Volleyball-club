import { GameEvent } from "@/types/calendar";
import { Competition } from "@/types/firestore";
import { Dayjs } from "dayjs";
import { openWindowWithPost } from "./form";

export type GameEventWithTime = GameEvent & { dayjs: Dayjs };

export const sortGameEvents =
  (games: GameEventWithTime[]) =>
  (gameA: GameEventWithTime, gameB: GameEventWithTime): number => {
    const [aTime, bTime] = [gameA, gameB].map((game) => {
      if (game.dayjs.hour() === 0) {
        const sameCompetitionGames = games.filter(
          isSameCompetitionGame(game.competition)
        );

        if (sameCompetitionGames.length > 0) {
          const sameTeamGame = sameCompetitionGames.find(
            isSameTeam(game.homeTeam) || isSameTeam(game.awayTeam)
          );

          if (sameTeamGame) return sameTeamGame.dayjs.add(1, "minute");
          return sameCompetitionGames[0].dayjs.add(1, "minute");
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

const isSameTeam =
  (teamName?: string) =>
  (game: GameEvent): boolean =>
    game.homeTeam === teamName || game.awayTeam === teamName;

export const isGameSameDay =
  (date: Dayjs) =>
  (game: GameEvent): game is GameEventWithTime =>
    game.dayjs?.isSame(date, "day") === true;

export const isVenueFileAvailable = (
  game: GameEvent
): game is GameEvent & {
  venue: string;
  ffvbId: string;
  competition: GameEvent["competition"] & { season: string; ffvbId: string };
} =>
  !!game.venue &&
  !!game.competition?.season &&
  !!game.ffvbId &&
  !!game.competition.ffvbId;

export const openVenueFile = (game: GameEvent): void => {
  if (!isVenueFileAvailable(game)) return;

  const formData = {
    wss_saison: game.competition?.season,
    codmatch: game.ffvbId,
    codent: game.competition?.ffvbId,
  };

  openWindowWithPost(
    "https://www.ffvbbeach.org/ffvbapp/adressier/fiche_match_ffvb.php",
    formData
  );
};
