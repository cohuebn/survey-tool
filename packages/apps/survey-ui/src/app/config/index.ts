import {
  getFirebaseEmulatorConfig,
  getFirebaseOptionsFromEnvironment,
} from "@survey-tool/firebase-config";
import { getSupabaseConfigFromEnvironment } from "@survey-tool/supabase";

export function getAppConfig() {
  const firebaseConfig = getFirebaseOptionsFromEnvironment();
  const firebaseEmulatorConfig = getFirebaseEmulatorConfig();
  const supabaseConfig = getSupabaseConfigFromEnvironment();
  return {
    ...firebaseConfig,
    ...firebaseEmulatorConfig,
    ...supabaseConfig,
  };
}
