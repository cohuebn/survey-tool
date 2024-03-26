import { getOptionalBool, getRequired } from "@survey-tool/core";

import { FirebaseEmulatorConfig } from "./types";

/** Should the Firebase emulator be used by the application?
 * @returns true if the emulator should be used, false otherwise
 */
function useEmulator() {
  return getOptionalBool("USE_FIREBASE_EMULATOR");
}

/** Get the Firebase emulator configuration from environment variables */
export function getFirebaseEmulatorConfig(): FirebaseEmulatorConfig {
  return useEmulator()
    ? {
        useEmulator: true,
        emulatorHost: getRequired("FIREBASE_AUTH_EMULATOR_HOST"),
      }
    : { useEmulator: false };
}
