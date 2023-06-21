import { BulkWriterError } from "@google-cloud/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DocumentToSet } from "../types/firestore";
import { logError } from "./logging";

initializeApp();
export const firestoreDB = getFirestore();
firestoreDB.settings({ ignoreUndefinedProperties: true });

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
