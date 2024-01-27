import { getCompetitionId } from "../adapters/firestore";
import { CompetitionMetadataDto } from "../dto/competition";
import { updateCompetition } from "../firestore/update";
import { Calendar } from "../types/calendar";
import { createCalendar } from "./api/calendar/create";
import { updateCalendar } from "./api/calendar/update";

export const handleCompetitionCalendar = async (
  competition: CompetitionMetadataDto,
  calendars: Calendar[]
): Promise<Calendar> => {
  const calendar = await createOrUpdateCalendar(competition, calendars);

  await updateCompetition(getCompetitionId(competition), {
    calendarId: calendar.id,
  });

  return calendar;
};

const createOrUpdateCalendar = async (
  competition: CompetitionMetadataDto,
  calendars: Calendar[]
): Promise<Calendar> => {
  const description = `Ce calendrier contient tous les matchs de la compétition ${competition.name} sur la saison ${competition.season}.\n\nCe calendrier est mis à jour automatiquement.\n\nDéveloppé par Guillaume Saint-Donat pour le RAC Volley.\n\nSource: ${competition.url}`;
  const title = competition.name;
  const timeZone = "Europe/Paris";

  const calendar = calendars.find((calendar) => calendar.summary === title);

  if (!calendar) {
    return await createCalendar({
      title,
      timeZone,
      description,
    });
  }

  if (
    calendar.description !== description ||
    calendar.timeZone !== timeZone ||
    calendar.summary !== title
  ) {
    return await updateCalendar({
      title,
      timeZone,
      description,
    });
  }

  return calendar;
};
