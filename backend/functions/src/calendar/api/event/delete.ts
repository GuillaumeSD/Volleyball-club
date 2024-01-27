import { calendarApi } from "..";

export const deleteCalendarEvent = async (
  eventId: string,
  calendarId: string
): Promise<void> => {
  await calendarApi.events.delete({
    calendarId,
    eventId,
  });
};
