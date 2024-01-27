import { CompetitionMetadataDto, GameDto } from "../dto/competition";
import { CalendarEvent, CalendarEventParams } from "../types/calendar";
import { createCalendarEvent } from "./api/event/create";
import { deleteCalendarEvent } from "./api/event/delete";
import { updateCalendarEvent } from "./api/event/update";
import { gameToEventParams, getEventIdFromGame } from "./api/event/utils";

export const getSortedGames = (games: GameDto[], calendar: CalendarEvent[]) => {
  const gamesToCreateEvents = games.filter(
    (game) => !doesEventExist(game, calendar)
  );

  const gamesToUpdateEvents = games.filter((game) =>
    doesEventExist(game, calendar)
  );

  const eventsToDelete = calendar.filter(
    (event) => !doesGameExist(event, games)
  );

  return {
    gamesToCreateEvents,
    gamesToUpdateEvents,
    eventsToDelete,
  };
};

const doesEventExist = (game: GameDto, calendar: CalendarEvent[]) => {
  return calendar.some((event) => event.id === getEventIdFromGame(game));
};

const doesGameExist = (event: CalendarEvent, games: GameDto[]) => {
  return games.some((game) => getEventIdFromGame(game) === event.id);
};

export const handleCreateEvent =
  (calendarId: string, competition: CompetitionMetadataDto) =>
  async (game: GameDto) => {
    const eventParams = gameToEventParams(game, competition.url);

    await createCalendarEvent(calendarId, eventParams);
  };

export const handleUpdateEvent =
  (
    calendarId: string,
    competition: CompetitionMetadataDto,
    calendarEvents: CalendarEvent[]
  ) =>
  async (game: GameDto) => {
    const eventParams = gameToEventParams(game, competition.url);
    const eventId = getEventIdFromGame(game);

    const event = calendarEvents.find((event) => event.id === eventId);

    if (isEventAlreadyUpdated(event, game, eventParams)) return;

    await updateCalendarEvent(eventId, calendarId, eventParams);
  };

const isEventAlreadyUpdated = (
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

  return (
    eventParams?.summary === event.summary &&
    eventParams?.description === event.description &&
    eventParams?.location === event.location &&
    (areDatesEqual || isSpecialNoTimeGame) &&
    areAttachmentsEqual
  );
};

export const handleDeleteEvent =
  (calendarId: string) => async (event: CalendarEvent) => {
    await deleteCalendarEvent(event.id, calendarId);
  };
