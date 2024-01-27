import { CompetitionMetadataDto } from "../dto/competition";
import { firestoreDB } from "./index";

export const updateCompetition = async (
  competitionId: string,
  competition: Partial<CompetitionMetadataDto>
): Promise<void> => {
  await firestoreDB
    .collection("competitions")
    .doc(competitionId)
    .update(competition);
};
