import { logError } from "../logging";
import { DocumentToSet } from "../types/firestore";
import { firestoreDB } from "./index";
import { BulkWriterError } from "@google-cloud/firestore";

export const bulkSetFirestore = async (documents: DocumentToSet[]) => {
  const bulk = firestoreDB.bulkWriter();
  const errors: BulkWriterError[] = [];

  bulk.onWriteError((error) => {
    errors.push(error);
    return false;
  });

  for (const document of documents) {
    const { firestorePath, data } = document;
    const ref = firestoreDB.doc(firestorePath);
    bulk.set(ref, data, { merge: true });
  }

  await bulk.close();

  if (errors.length) {
    logError(new Error("Bulk set operation(s) failed"), { errors });
  }
};
