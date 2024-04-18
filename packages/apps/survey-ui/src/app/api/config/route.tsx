import {
  getFirebaseEmulatorConfig,
  getFirebaseOptionsFromEnvironment,
} from "@survey-tool/firebase-config";

export async function GET() {
  const firebaseConfig = getFirebaseOptionsFromEnvironment();
  const firebaseEmulatorConfig = getFirebaseEmulatorConfig();
  return Response.json({ ...firebaseConfig, ...firebaseEmulatorConfig });
}
