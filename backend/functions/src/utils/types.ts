import { calendar_v3 } from "googleapis";
import { Calendar, CalendarEvent } from "../types/calendar";

export const isCalendar = (
  calendar: calendar_v3.Schema$Calendar
): calendar is Calendar => {
  return !!calendar.id;
};

export const isCalendarEvent = (
  event: calendar_v3.Schema$Event
): event is CalendarEvent => {
  return !!event.id;
};
