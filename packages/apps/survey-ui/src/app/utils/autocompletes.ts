import { HTMLAttributes } from "react";

/**
 * Work-around for MUI issue when spreading props containing a key;
 * key is not defined as a possible field props, but is sometimes provided at runtime.
 * Only use this when a key is explicitly defined for each option.s
 * @param props The props to convert into spreadable props
 * @returns The spreadable props (all props except 'key')
 */
export function getSpreadableOptionProps(props: HTMLAttributes<HTMLLIElement>) {
  const spreadableProps = { ...props };
  if ("key" in spreadableProps) delete spreadableProps.key;
  return spreadableProps;
}
