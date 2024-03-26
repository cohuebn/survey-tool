import { createLogger } from "@survey-tool/core";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import { FirebaseEmulatorConfig } from "@survey-tool/firebase-config/types";
import { getFirebaseEmulatorConfig } from "@survey-tool/firebase-config";

import { defaultFirebaseApp } from "./app";

const logger = createLogger("firebase/auth");

type EmulatorConfigResult =
  | FirebaseEmulatorConfig
  | Promise<FirebaseEmulatorConfig>;

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
) {
  const defaultedApp = app ?? defaultFirebaseApp();
  const emulatorConfig = await emulatorConfigProvider();
  if (!emulatorConfig.useEmulator) return getAuth(defaultedApp);

  const { emulatorHost } = emulatorConfig;
  const emulatorUrl = `http://${emulatorHost}`;
  logger.debug(
    { emulatorHost, emulatorUrl },
    "Using Firebase emulator for auth",
  );
  const auth = getAuth(defaultedApp);
  connectAuthEmulator(auth, emulatorUrl);
  return auth;
}
