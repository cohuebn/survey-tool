import { isNullOrUndefined } from "@survey-tool/core";

/**
 * Get the 'options' section from the given question definition.
 * If no 'options' section found, return an empty array.
 * @param definition The question definition to get options from
 * @returns The options array, or an empty array if no options found
 */
export function getOptions(
  definition: Record<string, unknown> | undefined,
): string[] {
  if (isNullOrUndefined(definition)) return [];
  const { options } = definition;
  return options && Array.isArray(options) ? options : [];
}
