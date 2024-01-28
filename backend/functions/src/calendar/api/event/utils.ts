import { GameDto } from "../../../dto/competition";
import { CalendarEvent, CalendarEventParams } from "../../../types/calendar";
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
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 90 }],
    },
  };
};

export const getEventIdFromGame = (game: GameDto): string => {
  return game.ffvbId.toLowerCase();
};

export const isEventAlreadyUpdated = (
  event: CalendarEvent | undefined,
  game: GameDto,
  eventParams: CalendarEventParams
) => {
  if (!event) return false;

  const areDatesEqual =
    eventParams?.start?.dateTime?.split("T")[0] ===
      event.start?.dateTime?.split("T")[0] &&
    game.time === event.start?.dateTime?.split("T")[1].slice(0, 5) &&
    eventParams?.end?.dateTime?.split("T")[0] ===
      event.end?.dateTime?.split("T")[0];

  const isSpecialNoTimeGame =
    !game.time &&
    eventParams?.end?.dateTime?.split("T")[0] ===
      event.end?.dateTime?.split("T")[0];

  const areAttachmentsEqual =
    eventParams?.attachments?.length === event.attachments?.length &&
    eventParams?.attachments?.every((attachment) =>
      event.attachments?.some(
        (eventAttachment) =>
          eventAttachment.fileUrl === attachment.fileUrl &&
          eventAttachment.title === attachment.title &&
          eventAttachment.mimeType === attachment.mimeType &&
          eventAttachment.iconLink === attachment.iconLink
      )
    ) !== false;

  const areRemindersEqual =
    eventParams?.reminders?.useDefault === event.reminders?.useDefault &&
    eventParams?.reminders?.overrides?.length ===
      event.reminders?.overrides?.length &&
    eventParams?.reminders?.overrides?.every((reminder) =>
      event.reminders?.overrides?.some(
        (eventReminder) =>
          eventReminder.method === reminder.method &&
          eventReminder.minutes === reminder.minutes
      )
    ) !== false;

  return (
    eventParams?.summary === event.summary &&
    eventParams?.description === event.description &&
    eventParams?.location === event.location &&
    (areDatesEqual || isSpecialNoTimeGame) &&
    areAttachmentsEqual &&
    areRemindersEqual
  );
};
