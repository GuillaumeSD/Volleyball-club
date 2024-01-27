import { calendarApi } from "../index";

export const publishCalendar = async (calendarId: string): Promise<void> => {
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
