import * as dayjs from "dayjs";
import "dayjs/locale/fr";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { getClubCompetitionsUrls } from "../parser/club";
import { getCompetitionData } from "../parser/competition";
import { isNotNull } from "../utils/helpers";
import {
  competitionDtoToFirestore,
  getCompetitionId,
} from "../adapters/firestore";
import { bulkSetFirestore } from "../firestore/set";
import { deleteOutdatedGames } from "../firestore/delete";

dayjs.locale("fr");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const refreshCompetitionsData = async (
  clubId: string
): Promise<string[]> => {
  const competitionsUrl = await getClubCompetitionsUrls(clubId);

  const competitions = await Promise.all(
    competitionsUrl.map(getCompetitionData)
  );

  const validCompetitions = competitions.filter(isNotNull);

  const documentsToSet = validCompetitions.flatMap(competitionDtoToFirestore);

  await bulkSetFirestore(documentsToSet);

  const competitionsIds = validCompetitions.map(({ metadata }) =>
    getCompetitionId(metadata)
  );

  await deleteOutdatedGames(competitionsIds, documentsToSet);

  return competitionsIds;
};
