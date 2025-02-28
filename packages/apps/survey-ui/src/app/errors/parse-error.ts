import { isObject } from "@survey-tool/core";

import { isFirebaseError, parseFirebaseError } from "./parse-firebase-error";

async function parseHttpResponse(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return "error" in body ? body.error : JSON.stringify(body);
  } catch (err: unknown) {
    return `HttpError (${response.statusText})`;
  }
}

/**
 * Common error parsing to render a more user-friendly message
 * from an Error
 */
export async function parseError(err: unknown): Promise<string> {
  if (!isObject(err)) return `${err}`;

  if (isFirebaseError(err)) return parseFirebaseError(err);

  if (err instanceof Response) return parseHttpResponse(err);

  return isObject(err) && "message" in err ? `${err.message}` : `${err}`;
}
