export type FirebaseEmulatorDisabledConfig = {
  useEmulator: false;
};

export type FirebaseEmulatorEnabledConfig = {
  useEmulator: true;
  emulatorHost: string;
  emulatorFirestorePort: number;
};

export type FirebaseEmulatorConfig =
  | FirebaseEmulatorDisabledConfig
  | FirebaseEmulatorEnabledConfig;
