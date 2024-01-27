import { calendarApi } from "../index";
import { CalendarEventParams } from "../../../types/calendar";

export const updateCalendarEvent = async (
  eventId: string,
  calendarId: string,
  params: CalendarEventParams
): Promise<void> => {
  await calendarApi.events.update({
    calendarId,
    eventId,
    requestBody: params,
    supportsAttachments: !!params?.attachments?.length,
  });
};
