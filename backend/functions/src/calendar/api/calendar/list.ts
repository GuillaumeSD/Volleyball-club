import { Calendar, CalendarListResponse } from "../../../types/calendar";
import { isCalendar } from "../../../utils/types";
import { calendarApi } from "../index";

export const listCalendars = async (): Promise<Calendar[]> => {
  const calendars: Calendar[] = [];
  let nextPageToken = undefined;

  do {
    const res: CalendarListResponse = await calendarApi.calendarList.list({
      maxResults: 250,
      pageToken: nextPageToken,
    });

    calendars.push(...(res.data.items?.filter(isCalendar) ?? []));

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return calendars;
};
