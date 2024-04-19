import { isObject } from "@survey-tool/core";

import { isFirebaseError, parseFirebaseError } from "./parse-firebase-error";

/**
 * Common error parsing to render a more user-friendly message
 * from an Error
 */
export function parseError(err: unknown): string {
  if (!isObject(err)) return `${err}`;

  if (isFirebaseError(err)) return parseFirebaseError(err);

  return isObject(err) && "message" in err ? `${err.message}` : `${err}`;
}
