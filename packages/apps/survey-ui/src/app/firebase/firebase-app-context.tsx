"use client";

import { createLogger } from "@survey-tool/core";
import { getLazyLoadedFirebaseApp } from "@survey-tool/firebase";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { ReactNode, createContext, useEffect, useState } from "react";

const logger = createLogger("firebase-app-context");

export const revalidate = 60;

/** Get a Firebase app using config from the API */
async function getFirebaseApp() {
  logger.debug("Getting Firebase app using config from API");
  const configResponse = await fetch("/api/config");
  const config: FirebaseOptions = await configResponse.json();
  return getLazyLoadedFirebaseApp(config);
}

export const FirebaseAppContext = createContext<FirebaseApp | null>(null);

type FirebaseAppProviderProps = {
  children: ReactNode;
};

export const FirebaseAppProvider = ({ children }: FirebaseAppProviderProps) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);

  useEffect(() => {
    getFirebaseApp().then(setFirebaseApp);
  }, []);

  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
      {children}
    </FirebaseAppContext.Provider>
  );
};
