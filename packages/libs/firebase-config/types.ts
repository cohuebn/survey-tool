export type FirebaseEmulatorDisabledConfig = {
  useEmulator: false;
};

export type FirebaseEmulatorEnabledConfig = {
  useEmulator: true;
  emulatorHost: string;
};

export type FirebaseEmulatorConfig =
  | FirebaseEmulatorDisabledConfig
  | FirebaseEmulatorEnabledConfig;
