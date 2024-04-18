import {
  isNotNullOrUndefined,
  isObject,
  isObjectWithProperty,
} from "@survey-tool/core";
import { FirebaseError } from "firebase/app";

/* Firebase is silly and doesn't always throw actual Firebase errors;
 * sometimes it throws regular Error objects with FirebaseError properties.
 * This function checks if an error is a FirebaseError.
 */
function isFirebaseError(err: unknown): err is FirebaseError {
  if (err instanceof FirebaseError) return true;
  return (
    err instanceof Error &&
    isObjectWithProperty(err, "code") &&
    isObjectWithProperty(err, "name") &&
    isObjectWithProperty(err, "message") &&
    isObjectWithProperty(err, "customData")
  );
}

const mappedFirebaseErrors = [
  {
    pattern: /\(auth\/invalid-login-credentials\)/,
    message:
      "Sorry, the username or password you entered is incorrect. Please double-check your information and try again.",
  },
];

function parseFirebaseError(err: FirebaseError): string {
  const fieldsToMatch = [err.code, err.customData?.message].filter(
    (field): field is string =>
      isNotNullOrUndefined(field) && typeof field === "string",
  );
  // eslint-disable-next-line no-console
  console.log({ fieldsToMatch });
  const mappedError = mappedFirebaseErrors.find(({ pattern }) =>
    fieldsToMatch.some((fieldToMatch) => pattern.test(fieldToMatch)),
  );
  // If we have a mapped error, return the mapped message. Otherwise, the Firebase
  // error message with the Firebase prefix and code stripped off.
  return mappedError
    ? mappedError.message
    : err.message.replace(/Firebase: /, "").replace(/\s*\(.*\/.*\)\.$/, "");
}

/**
 * Common error parsing to render a more user-friendly message
 * from an Error
 */
export function parseError(err: unknown): string {
  if (!isObject(err)) return `${err}`;

  if (isFirebaseError(err)) return parseFirebaseError(err);

  return isObject(err) && "message" in err ? `${err.message}` : `${err}`;
}
