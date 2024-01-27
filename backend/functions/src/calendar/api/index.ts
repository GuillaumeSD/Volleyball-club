import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

const auth = new GoogleAuth({
  keyFile: "./calendar-service-account.json",
  scopes: "https://www.googleapis.com/auth/calendar",
});

export const calendarApi = google.calendar({
  version: "v3",
  auth,
});
