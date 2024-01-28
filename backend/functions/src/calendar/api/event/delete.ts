import { calendarApi } from "..";
import { logCatchedError } from "../../../logging";

export const deleteCalendarEvent = async (
  eventId: string,
  calendarId: string
): Promise<void> => {
  await calendarApi.events
    .delete({
      calendarId,
      eventId,
    })
    .catch(
      logCatchedError({ action: "delete calendar event", eventId, calendarId })
    );
};
