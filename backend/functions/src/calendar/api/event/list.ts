import { CalendarEvent } from "../../../types/calendar";
import { isCalendarEvent } from "../../../utils/types";
import { calendarApi } from "../index";

export const listCalendarEvents = async (
  calendarId: string
): Promise<CalendarEvent[]> => {
  const res = await calendarApi.events.list({
    calendarId,
    maxResults: 1000,
  });

  return res.data.items?.filter(isCalendarEvent) ?? [];
};
