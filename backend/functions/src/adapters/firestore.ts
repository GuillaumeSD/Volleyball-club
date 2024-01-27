import {
  CompetitionDto,
  CompetitionMetadataDto,
  GameDto,
} from "../dto/competition";
import { DocumentToSet } from "../types/firestore";

export const competitionDtoToFirestore = (
  competition: CompetitionDto
): DocumentToSet<CompetitionMetadataDto | GameDto>[] => {
  const firestoreCompetition = competitionMetadataDtoToFirestore(
    competition.metadata
  );
  const firestoreGames = gamesDtoToFirestore(competition);

  return [firestoreCompetition, ...firestoreGames];
};

export const competitionMetadataDtoToFirestore = (
  competition: CompetitionMetadataDto
): DocumentToSet<CompetitionMetadataDto> => {
  const competitionId = getCompetitionId(competition);
  return {
    firestorePath: `competitions/${competitionId}`,
    data: competition,
  };
};

export const gamesDtoToFirestore = (
  competition: CompetitionDto
): DocumentToSet<GameDto>[] => {
  const competitionId = getCompetitionId(competition.metadata);

  const firestoreGames = competition.games.map((game) => {
    const { ffvbId: gameId } = game;
    return {
      firestorePath: `competitions/${competitionId}/games/${gameId}`,
      data: game,
    };
  });

  return firestoreGames;
};

export const getCompetitionId = (
  competition: CompetitionMetadataDto
): string => {
  const { ffvbId, pool, season } = competition;
  return `${ffvbId}_${pool}_${season.replaceAll("/", "_")}`;
};
