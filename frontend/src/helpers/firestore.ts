import { WithDocMetaData } from "@/types/firestore";
import { DocumentData, Query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFirestoreCollection = <T>(
  collection: Query<DocumentData>
): WithDocMetaData<T>[] => {
  const [documents, setDocuments] = useState<WithDocMetaData<T>[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const docData = doc.data() as T;
        return {
          docId: doc.id,
          collectionParentId: doc.ref.parent.parent?.id,
          ...docData,
        };
      });
      setDocuments(docs);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return documents;
};
