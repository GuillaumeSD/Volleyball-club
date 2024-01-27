import { calendarApi } from "../index";
import { CalendarEventParams } from "../../../types/calendar";

export const createCalendarEvent = async (
  calendarId: string,
  params: CalendarEventParams
): Promise<void> => {
  await calendarApi.events.insert({
    calendarId,
    requestBody: params,
    supportsAttachments: !!params?.attachments?.length,
  });
};
