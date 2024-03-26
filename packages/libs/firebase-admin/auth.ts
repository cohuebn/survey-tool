import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { FirebaseApp } from "firebase/app";

import { defaultFirebaseAdminApp } from "./app";

/** Initialize Firebase admin auth for application use:
 * 1. If the Firebase emulator option is enabled, connect auth to the emulator
 * 2. If an app is provided, connect auth to the provided app
 * 3. If no app is provided, connect auth to the default app for the environment
 *
 * *
 * @param app The Firebase app if using an explicit application. If not provided,
 * the default firebase app will be used
 * @returns The Firebase auth admin object to use for interacting with Firebase's auth services
 */
export function getFirebaseAdminAuth(app?: FirebaseApp) {
  const defaultedApp = app ?? defaultFirebaseAdminApp();
  return getAdminAuth(defaultedApp);
}
