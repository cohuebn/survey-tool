import { initializeApp } from "firebase/app";
import { lazyLoad } from "@survey-tool/core";
import { getFirebaseOptionsFromEnvironment } from "@survey-tool/firebase-config";

/** A lazy-loaded Firebase app using environment variables for setting */
export const defaultFirebaseApp = lazyLoad(() => {
  const options = getFirebaseOptionsFromEnvironment();
  return initializeApp(options);
});
