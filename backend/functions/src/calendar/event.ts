import { CompetitionMetadataDto, GameDto } from "../dto/competition";
import { CalendarEvent } from "../types/calendar";
import { createCalendarEvent } from "./api/event/create";
import { deleteCalendarEvent } from "./api/event/delete";
import { updateCalendarEvent } from "./api/event/update";
import {
  gameToEventParams,
  getEventIdFromGame,
  isEventAlreadyUpdated,
} from "./api/event/utils";

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

    if (isEventAlreadyUpdated(event, game, eventParams)) {
      console.log(`Event ${eventId} already updated`);
      return;
    }

    await updateCalendarEvent(eventId, calendarId, eventParams);
  };

export const handleDeleteEvent =
  (calendarId: string) => async (event: CalendarEvent) => {
    await deleteCalendarEvent(event.id, calendarId);
  };
