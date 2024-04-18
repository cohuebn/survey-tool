import { FirebaseApp } from "firebase/app";
import { useContext, useEffect, useState } from "react";
import { Auth } from "firebase/auth";
import { getFirebaseAuth } from "@survey-tool/firebase";

import { FirebaseAppContext } from "./firebase-app-context";

/** A hook to get a Firebase auth instance using the nearest Firebase app context */
export function useFirebaseAuth() {
  const firebaseApp = useContext<FirebaseApp | null>(FirebaseAppContext);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);

  useEffect(() => {
    if (firebaseApp) {
      getFirebaseAuth(firebaseApp).then(setFirebaseAuth);
    }
  }, [firebaseApp]);

  return firebaseAuth;
}
