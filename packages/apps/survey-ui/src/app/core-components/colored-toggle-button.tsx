import { styled, ToggleButton, ToggleButtonProps } from "@mui/material";
import { omitUndefinedAndNullProperties } from "@survey-tool/core";

type ColoredToggleButtonProps = ToggleButtonProps & {
  backgroundColor?: string;
  textColor?: string;
};

export const ColoredToggleButton = styled(
  ToggleButton,
)<ColoredToggleButtonProps>(({ textColor, backgroundColor }) => ({
  "&.Mui-selected, &.Mui-selected:hover": omitUndefinedAndNullProperties({
    color: textColor,
    backgroundColor,
  }),
}));
