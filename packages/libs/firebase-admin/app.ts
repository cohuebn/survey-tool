import { initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getFirebaseOptionsFromEnvironment } from "@survey-tool/firebase-config";
import { lazyLoad } from "@survey-tool/core";

/** A lazy-loaded Firebase admin app using environment variables for setting */
export const defaultFirebaseAdminApp = lazyLoad(() => {
  const options = getFirebaseOptionsFromEnvironment();
  return initializeAdminApp(options);
});
