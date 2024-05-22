import { createLogger } from "@survey-tool/core";
import {
  getFirestore as coreGetFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { getFirebaseEmulatorConfig } from "@survey-tool/firebase-config";

import { defaultFirebaseApp } from "./app";
import { EmulatorConfigResult } from "./types";

const logger = createLogger("firebase/firestore");

/** Initialize Firebase auth for application use:
 * 1. If the Firebase emulator option is enabled, connect auth to the emulator
 * 2. If an app is provided, connect auth to the provided app
 * 3. If no app is provided, connect auth to the default app for the environment
 *
 * @param app The Firebase app if using an explicit application. If not provided,
 * the default firebase app will be used
 * @param emulatorConfigProvider The method that provides emulator config. If not provided,
 * the default provider will be used to get emulator config
 * @returns The Firebase auth object to use for interacting with Firebase's auth services
 */
export async function getFirestore(
  app?: FirebaseApp,
  emulatorConfigProvider: () => EmulatorConfigResult = getFirebaseEmulatorConfig,
) {
  const defaultedApp = app ?? defaultFirebaseApp();
  const emulatorConfig = await emulatorConfigProvider();
  const firestore = coreGetFirestore(defaultedApp);
  if (!emulatorConfig.useEmulator) return firestore;

  const { emulatorHost, emulatorFirestorePort } = emulatorConfig;
  logger.debug(
    { emulatorHost, emulatorFirestorePort },
    "Using Firebase emulator for auth",
  );
  connectFirestoreEmulator(firestore, emulatorHost, emulatorFirestorePort);
  return firestore;
}
