import { GameDto } from "../../../dto/competition";
import { CalendarEventParams } from "../../../types/calendar";
import { addXHours } from "../../../utils/helpers";

export const gameToEventParams = (
  game: GameDto,
  competitionUrl: string
): CalendarEventParams => {
  const startTime = game.timestamp?.toDate();

  if (!startTime) {
    return undefined;
  }

  return {
    id: getEventIdFromGame(game),
    summary: `${game.homeTeam} vs ${game.awayTeam}`,
    description:
      `<strong>Arbitre :</strong> ${game.referee ?? "Inconnu"}<br/>` +
      `<strong>Résultat :</strong> ${
        game.setsPoint?.join(" | ") ?? "TBD"
      }<br/>` +
      `<strong>Lien FFVB :</strong> ${competitionUrl}`,
    location: game.venue,
    start: {
      dateTime: startTime.toISOString(),
    },
    end: {
      dateTime: addXHours(startTime, 2).toISOString(),
    },
    attachments: game.fileUrl
      ? [
          {
            fileUrl: game.fileUrl,
            title: "Fichier de la rencontre",
            mimeType: "application/pdf",
          },
        ]
      : undefined,
  };
};

export const getEventIdFromGame = (game: GameDto): string => {
  return game.ffvbId.toLowerCase();
};
