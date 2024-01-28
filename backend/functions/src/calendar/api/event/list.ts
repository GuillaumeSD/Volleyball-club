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
    const res: CalendarEventListResponse = await calendarApi.events.list({
      calendarId,
      maxResults: 1000,
      pageToken: nextPageToken,
    });

    events.push(...(res.data.items?.filter(isCalendarEvent) ?? []));

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return events;
};
