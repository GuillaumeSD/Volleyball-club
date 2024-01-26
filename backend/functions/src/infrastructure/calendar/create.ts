import { CreateCalendarDto } from "../../domain/dto/calendar";
import { calendarApi } from "./api";
import { Calendar } from "../types/calendar";

export const createCalendar = async (
  params: CreateCalendarDto
): Promise<Calendar> => {
  const newCalendar = await calendarApi.calendars.insert({
    requestBody: {
      summary: params.title,
      timeZone: params.timeZone ?? "Europe/Paris",
      description: params.description,
    },
  });

  if (!newCalendar.data.id) {
    throw new Error("Calendar id is undefined");
  }

  await publishCalendar(newCalendar.data.id);

  return newCalendar.data;
};

const publishCalendar = async (calendarId: string): Promise<void> => {
  await calendarApi.acl.insert({
    calendarId,
    requestBody: {
      role: "reader",
      scope: {
        type: "default",
      },
    },
  });
};
