/**
 * Get the mean (average) of the provided values
 * @param values The values to get the mean of
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return (
    values.reduce((_mean, currentValue) => _mean + currentValue) / values.length
  );
}
