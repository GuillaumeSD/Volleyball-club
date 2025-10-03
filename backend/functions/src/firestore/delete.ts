import { BulkWriterError } from "@google-cloud/firestore";
import { firestoreDB } from "./index";
import { logError } from "../logging";
import { DocumentToSet } from "../types/firestore";
import { CompetitionMetadataDto, GameDto } from "../dto/competition";

export const bulkDeleteFirestore = async (documentPaths: string[]) => {
  const bulk = firestoreDB.bulkWriter();
  const errors: BulkWriterError[] = [];

  bulk.onWriteError((error) => {
    errors.push(error);
    return false;
  });

  for (const path of documentPaths) {
    const ref = firestoreDB.doc(path);
    bulk.delete(ref);
  }

  await bulk.close();

  if (errors.length) {
    logError(new Error("Bulk delete operation(s) failed"), { errors });
  }
};

export const deleteOutdatedGames = async (
  competitionsIds: string[],
  documentsSet: DocumentToSet<CompetitionMetadataDto | GameDto>[]
): Promise<void> => {
  for (const competitionId of competitionsIds) {
    const competitionGames = await firestoreDB
      .collection(`competitions/${competitionId}/games`)
      .get();

    const gamesToDelete = competitionGames.docs.filter((doc) => {
      const gameData = doc.data() as GameDto;
      return !documentsSet
        .filter((d) => d.firestorePath.includes(competitionId))
        .some((d) => d.data.ffvbId === gameData.ffvbId);
    });

    if (gamesToDelete.length) {
      console.log(
        `Should delete ${gamesToDelete.length} outdated games in competition ${competitionId}`
      );
      // await bulkDeleteFirestore(gamesToDelete.map((doc) => doc.ref.path));
    }
  }
};
