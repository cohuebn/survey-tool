import { FirebaseEmulatorConfig } from "@survey-tool/firebase-config";

export type EmulatorConfigResult =
  | FirebaseEmulatorConfig
  | Promise<FirebaseEmulatorConfig>;
