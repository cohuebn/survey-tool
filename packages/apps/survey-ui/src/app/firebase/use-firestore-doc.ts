import { createLogger } from "@survey-tool/core";
import { Firestore, onSnapshot, doc as firestoreDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type FirestoreDocResult<T> = {
  loading: boolean;
  doc: T | undefined;
  error: Error | undefined;
};

const logger = createLogger("firebase/use-firestore-doc");

export function useFirestoreDoc<T = unknown>(
  firestore: Firestore | null | undefined,
  collection: string | null | undefined,
  path: string | null | undefined,
): FirestoreDocResult<T> {
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const loadDoc = useCallback(
    (_firestore: Firestore, _collection: string, _path: string) => {
      logger.debug({ _firestore, _collection, _path }, "Loading doc");
      const docRef = firestoreDoc(_firestore, _collection, _path);
      return onSnapshot(
        docRef,
        (snapshot) => {
          logger.debug({ snapshot }, "Doc loaded");
          setDoc(snapshot.data() as T);
          setLoading(false);
        },
        setError,
      );
    },
    [],
  );

  useEffect(() => {
    return firestore && collection && path
      ? loadDoc(firestore, collection, path)
      : undefined;
  }, [firestore, loadDoc, collection, path]);

  return { doc, loading, error };
}
