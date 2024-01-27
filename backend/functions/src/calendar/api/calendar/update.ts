import { CreateCalendarDto } from "../../../dto/calendar";
import { Calendar } from "../../../types/calendar";
import { isCalendar } from "../../../utils/types";
import { calendarApi } from "../index";

export const updateCalendar = async (
  params: CreateCalendarDto
): Promise<Calendar> => {
  const { data: calendar } = await calendarApi.calendars.update({
    requestBody: {
      summary: params.title,
      timeZone: params.timeZone ?? "Europe/Paris",
      description: params.description,
    },
  });

  if (!isCalendar(calendar)) {
    throw new Error("Calendar id is undefined");
  }

  return calendar;
};
