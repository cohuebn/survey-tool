import { styled, ToggleButton, ToggleButtonProps } from "@mui/material";
import { omitUndefinedAndNullProperties } from "@survey-tool/core";

type ColoredToggleButtonProps = ToggleButtonProps & {
  backgroundColor?: string;
  textColor?: string;
};

/** Prevent passing custom properties down to the underlying ToggleButton */
function shouldForwardProp(prop: PropertyKey): boolean {
  return prop !== "backgroundColor" && prop !== "textColor";
}

export const ColoredToggleButton = styled(ToggleButton, {
  shouldForwardProp,
})<ColoredToggleButtonProps>(({ textColor, backgroundColor }) => ({
  " .icon": {
    color: textColor,
  },

  "&.Mui-selected, :hover": omitUndefinedAndNullProperties({
    color: "white",
    backgroundColor,

    "& .icon": {
      color: "white",
    },
  }),
}));
