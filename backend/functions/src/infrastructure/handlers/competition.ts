import * as dayjs from "dayjs";
import "dayjs/locale/fr";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { getClubCompetitionsUrls } from "../../domain/club";
import { getCompetitionData, getCompetitionId } from "../../domain/competition";
import { isNotNull } from "../../domain/utils/helpers";
import { competitionDtoToFirestore } from "../adapters/firestore";
import { bulkSetFirestore } from "../firestore/setDocuments";
import { deleteOutdatedGames } from "../firestore/deleteDocuments";

dayjs.locale("fr");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const refreshCompetitionsData = async (
  clubId: string
): Promise<void> => {
  console.log("hello");
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

  await deleteOutdatedGames(competitionsIds);
};
