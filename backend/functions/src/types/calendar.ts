import { calendar_v3 } from "googleapis";
import { WithRequired } from "./utils";

export type Calendar = WithRequired<calendar_v3.Schema$Calendar, "id">;

export type CalendarEvent = WithRequired<calendar_v3.Schema$Event, "id">;

export type CalendarEventParams =
  calendar_v3.Params$Resource$Events$Insert["requestBody"];
