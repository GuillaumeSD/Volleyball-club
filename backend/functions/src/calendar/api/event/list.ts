import { logCatchedError } from "../../../logging";
import {
  CalendarEvent,
  CalendarEventListResponse,
} from "../../../types/calendar";
import { isCalendarEvent } from "../../../utils/types";
import { calendarApi } from "../index";

export const listCalendarEvents = async (
  calendarId: string
): Promise<CalendarEvent[]> => {
  let nextPageToken = undefined;
  const events: CalendarEvent[] = [];

  do {
    const res: CalendarEventListResponse = await calendarApi.events
      .list({
        calendarId,
        pageToken: nextPageToken,
        showDeleted: true,
      })
      .catch(
        logCatchedError({
          calendarId,
          nextPageToken,
          action: "list calendar events",
        })
      );

    events.push(...(res.data.items?.filter(isCalendarEvent) ?? []));

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return events;
};
