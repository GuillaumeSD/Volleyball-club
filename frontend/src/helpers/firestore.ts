import { WithDocMetaData } from "@/types/firestore";
import {
  DocumentSnapshot,
  FirestoreError,
  Query,
  onSnapshot,
  queryEqual,
} from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export const useFirestoreCollection = <T>(
  collection: Query
): WithDocMetaData<T>[] => {
  const { enqueueSnackbar } = useSnackbar();
  const [documents, setDocuments] = useState<WithDocMetaData<T>[]>([]);
  const [query, setQuery] = useState(collection);

  useEffect(() => {
    if (!queryEqual(collection, query)) {
      setDocuments([]);
      setQuery(collection);
    }
  }, [collection, query]);

  useEffect(() => {
    const onFirestoreError = (error: FirestoreError) => {
      console.error(error);
      enqueueSnackbar(
        "Une erreur est survenue lors de la récupération des données !",
        { variant: "error" }
      );
    };

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => setDocuments(snapshot.docs.map(formatDocument<T>)),
      onFirestoreError
    );

    return () => unsubscribe();
  }, [query, enqueueSnackbar]);

  return documents;
};

const formatDocument = <T>(doc: DocumentSnapshot): WithDocMetaData<T> => {
  const docData = doc.data() as T;
  return {
    docId: doc.id,
    collectionParentId: doc.ref.parent.parent?.id,
    ...docData,
  };
};
