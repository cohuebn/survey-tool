import { isNullOrUndefined } from "@survey-tool/core";

/**
 * Sometimes in our UI, we want to convert an empty text box value
 * into undefined in our data model. This function trims the input string
 * so that only-whitespace of any kind is considered empty.
 * @param value The value to convert; if it is an empty string, it will be converted to undefined.
 * Otherwise, it'll be returned as-is
 * @returns The value, or undefined if the value was an empty string
 */
export function emptyToUndefined(
  value: string | undefined,
): string | undefined {
  return isNullOrUndefined(value) || value.trim() === "" ? undefined : value;
}
