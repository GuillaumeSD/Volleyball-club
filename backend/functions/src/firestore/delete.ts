import { BulkWriterError } from "@google-cloud/firestore";
import { firestoreDB } from "./index";
import { logError } from "../logging";

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
  competitionsIds: string[]
): Promise<void> => {
  const getAllGames = await firestoreDB.collectionGroup("games").get();

  const documentsToDelete = getAllGames.docs.filter((doc) => {
    doc.updateTime.toMillis() < Date.now() - 1000 * 60 * 5 &&
      competitionsIds.includes(doc.ref.parent.parent?.id ?? "");
  });
  console.log(`Deleting ${documentsToDelete.length} outdated games`);

  await bulkDeleteFirestore(documentsToDelete.map((doc) => doc.ref.path));
};
