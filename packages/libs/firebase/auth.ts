import { createLogger } from "@survey-tool/core";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import { getFirebaseEmulatorConfig } from "@survey-tool/firebase-config";

import { defaultFirebaseApp } from "./app";
import { EmulatorConfigResult } from "./types";

const logger = createLogger("firebase/auth");

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
export async function getFirebaseAuth(
  app?: FirebaseApp,
  emulatorConfigProvider: () => EmulatorConfigResult = getFirebaseEmulatorConfig,
): Promise<Auth> {
  const defaultedApp = app ?? defaultFirebaseApp();
  const emulatorConfig = await emulatorConfigProvider();
  const auth = getAuth(defaultedApp);
  if (!emulatorConfig.useEmulator) return auth;

  const { emulatorHost } = emulatorConfig;
  const emulatorUrl = `http://${emulatorHost}`;
  logger.debug(
    { emulatorHost, emulatorUrl },
    "Using Firebase emulator for auth",
  );
  connectAuthEmulator(auth, emulatorUrl);
  return auth;
}
