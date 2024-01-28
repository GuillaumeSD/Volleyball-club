import { calendarApi } from "../index";
import { CalendarEventParams } from "../../../types/calendar";
import { logCatchedError } from "../../../logging";

export const updateCalendarEvent = async (
  eventId: string,
  calendarId: string,
  params: CalendarEventParams
): Promise<void> => {
  await calendarApi.events
    .update({
      calendarId,
      eventId,
      requestBody: params,
      supportsAttachments: !!params?.attachments?.length,
    })
    .catch(
      logCatchedError({
        action: "update calendar event",
        eventId,
        calendarId,
        params,
      })
    );
};
