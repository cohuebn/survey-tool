import { getOptional, getRequired } from "@survey-tool/core";
import { FirebaseOptions } from "firebase/app";

export function getFirebaseOptionsFromEnvironment(): FirebaseOptions {
  return {
    projectId: getRequired("FIREBASE_PROJECT_ID"),
    apiKey: getOptional("FIREBASE_API_KEY"),
    authDomain: getOptional("FIREBASE_AUTH_DOMAIN"),
    storageBucket: getOptional("FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getOptional("FIREBASE_MESSAGING_SENDER_ID"),
    appId: getOptional("FIREBASE_APP_ID"),
    measurementId: getOptional("FIREBASE_MEASUREMENT_ID"),
  };
}
