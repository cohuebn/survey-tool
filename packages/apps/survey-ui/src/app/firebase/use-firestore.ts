"use client";

import { FirebaseApp } from "firebase/app";
import { useContext, useEffect, useState } from "react";
import { getFirestore } from "@survey-tool/firebase";
import { Firestore } from "firebase/firestore";

import { FirebaseAppContext } from "./firebase-app-context";

/** A hook to get a Firebase auth instance using the nearest Firebase app context */
export function useFirestore() {
  const firebaseApp = useContext<FirebaseApp | null>(FirebaseAppContext);
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    if (firebaseApp) {
      getFirestore(firebaseApp).then(setFirestore);
    }
  }, [firebaseApp]);

  return firestore;
}
