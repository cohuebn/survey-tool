import { FirebaseOptions, initializeApp } from "firebase/app";
import { lazyLoad } from "@survey-tool/core";
import { getFirebaseOptionsFromEnvironment } from "@survey-tool/firebase-config";

/** A lazy-loaded Firebase app using environment variables for setting */
export const defaultFirebaseApp = lazyLoad(() => {
  const options = getFirebaseOptionsFromEnvironment();
  return initializeApp(options);
});

/**
 * Given Firebase options, get a lazy-loaded app that can be used
 * by other Firebase services
 * @param options The Firebase options to use for the app
 * @returns A lazy-loaded Firebase app using the provided options
 */
export function getLazyLoadedFirebaseApp(options: FirebaseOptions) {
  return lazyLoad(() => initializeApp(options));
}
