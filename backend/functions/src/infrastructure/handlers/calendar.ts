import { calendarApi } from "../calendar/api";
import { createCalendar } from "../calendar/create";

export const updateCalendar = async (): Promise<void> => {
  const newCalendar = await createCalendar({
    title: "New test Calendar",
    timeZone: "Europe/Paris",
    description: "This is a test calendar",
  });

  console.log(newCalendar);

  const calendars = await calendarApi.calendarList.list();
  calendars.data.items?.forEach(async (calendar) => {
    console.log(calendar);
    await calendarApi.calendars.delete({
      calendarId: calendar.id!,
    });
  });
};
