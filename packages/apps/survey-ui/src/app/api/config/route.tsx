import {
  getFirebaseEmulatorConfig,
  getFirebaseOptionsFromEnvironment,
} from "@survey-tool/firebase-config";
import { getSupabaseConfigFromEnvironment } from "@survey-tool/supabase";

export async function GET() {
  const firebaseConfig = getFirebaseOptionsFromEnvironment();
  const firebaseEmulatorConfig = getFirebaseEmulatorConfig();
  const supabaseConfig = getSupabaseConfigFromEnvironment();
  return Response.json({
    ...firebaseConfig,
    ...firebaseEmulatorConfig,
    ...supabaseConfig,
  });
}
