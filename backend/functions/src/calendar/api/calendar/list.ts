import { Calendar } from "../../../types/calendar";
import { isCalendar } from "../../../utils/types";
import { calendarApi } from "../index";

export const listCalendars = async (): Promise<Calendar[]> => {
  const res = await calendarApi.calendarList.list({ maxResults: 250 });

  return res.data.items?.filter(isCalendar) ?? [];
};
