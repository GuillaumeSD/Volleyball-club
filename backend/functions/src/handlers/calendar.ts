import { listCalendars } from "../calendar/api/calendar/list";
import { getCompetition } from "../firestore/get";
import { listCalendarEvents } from "../calendar/api/event/list";
import { handleCompetitionCalendar } from "../calendar/calendar";
import {
  getSortedGames,
  handleCreateEvent,
  handleDeleteEvent,
  handleUpdateEvent,
} from "../calendar/event";

export const handleUpdateCalendar = async (
  competitionsIds: string[]
): Promise<void> => {
  const calendars = await listCalendars();

  for (const competitionId of competitionsIds) {
    const competition = await getCompetition(competitionId);

    const calendar = await handleCompetitionCalendar(
      competition.metadata,
      calendars
    );

    const calendarEvents = await listCalendarEvents(calendar.id);

    const { gamesToCreateEvents, gamesToUpdateEvents, eventsToDelete } =
      getSortedGames(competition.games, calendarEvents);

    await Promise.all(
      gamesToCreateEvents.map(
        handleCreateEvent(calendar.id, competition.metadata)
      )
    );

    await Promise.all(
      gamesToUpdateEvents.map(
        handleUpdateEvent(calendar.id, competition.metadata, calendarEvents)
      )
    );

    await Promise.all(eventsToDelete.map(handleDeleteEvent(calendar.id)));
  }
};
