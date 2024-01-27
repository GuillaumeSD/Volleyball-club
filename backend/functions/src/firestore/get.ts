import { firestoreDB } from "./index";
import {
  CompetitionDto,
  CompetitionMetadataDto,
  GameDto,
} from "../dto/competition";

export const getCompetition = async (
  competitionId: string
): Promise<CompetitionDto> => {
  const competition = await firestoreDB
    .collection("competitions")
    .doc(competitionId)
    .get();

  if (!competition.exists) {
    throw new Error("Competition not found");
  }

  const games = await firestoreDB
    .collection("competitions")
    .doc(competitionId)
    .collection("games")
    .get();

  return {
    metadata: competition.data() as CompetitionMetadataDto,
    games: games.docs.map((game) => game.data() as GameDto),
  };
};
