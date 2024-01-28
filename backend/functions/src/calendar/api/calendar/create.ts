import { CreateCalendarDto } from "../../../dto/calendar";
import { calendarApi } from "../index";
import { Calendar } from "../../../types/calendar";
import { publishCalendar } from "./publish";
import { isCalendar } from "../../../utils/types";
import { logCatchedError } from "../../../logging";

export const createCalendar = async (
  params: CreateCalendarDto
): Promise<Calendar> => {
  const { data: calendar } = await calendarApi.calendars
    .insert({
      requestBody: {
        summary: params.title,
        timeZone: params.timeZone ?? "Europe/Paris",
        description: params.description,
      },
    })
    .catch(logCatchedError({ params, action: "create calendar" }));

  if (!isCalendar(calendar)) {
    throw new Error("Calendar id is undefined");
  }

  await publishCalendar(calendar.id);

  return calendar;
};
