import { isNotNullOrUndefined, isObjectWithProperty } from "@survey-tool/core";
import { FirebaseError } from "firebase/app";

/* Firebase is silly and doesn't always throw actual Firebase errors;
 * sometimes it throws regular Error objects with FirebaseError properties.
 * This function checks if an error is a FirebaseError.
 */
export function isFirebaseError(err: unknown): err is FirebaseError {
  if (err instanceof FirebaseError) return true;
  return (
    err instanceof Error &&
    isObjectWithProperty(err, "code") &&
    isObjectWithProperty(err, "name") &&
    isObjectWithProperty(err, "message") &&
    isObjectWithProperty(err, "customData")
  );
}

type MappedFirebaseError = {
  pattern: RegExp;
  message: string;
};
const mappedFirebaseErrors: MappedFirebaseError[] = [
  {
    pattern: /\(auth\/invalid-email\)/,
    message:
      "Sorry, that does not appear to be a valid email address in our system.",
  },
  {
    pattern: /\(auth\/missing-email\)/,
    message: "Please enter an email address.",
  },
  {
    pattern: /\(auth\/invalid-login-credentials\)/,
    message:
      "Sorry, that username/password combination is not found in our system. Please double-check your information and try again.",
  },
  {
    pattern: /\(auth\/email-already-in-use\)/,
    message:
      "Sorry, that email address is already in use. Please try logging in instead.",
  },
];

export function parseFirebaseError(err: FirebaseError): string {
  const fieldsToMatch = [err.code, err.customData?.message].filter(
    (field): field is string =>
      isNotNullOrUndefined(field) && typeof field === "string",
  );
  const mappedError = mappedFirebaseErrors.find(({ pattern }) =>
    fieldsToMatch.some((fieldToMatch) => pattern.test(fieldToMatch)),
  );
  // If we have a mapped error, return the mapped message. Otherwise, the Firebase
  // error message with the Firebase prefix and code stripped off.
  return mappedError
    ? mappedError.message
    : err.message.replace(/Firebase: /, "").replace(/\s*\(.*\/.*\)\.$/, "");
}
