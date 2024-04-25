"use client";

import { Lato } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import { colors } from "./tokens";

const latoFont = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

/** Patching of MUI types */
declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "outlined" | "default";
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: latoFont.style.fontFamily,
  },
  components: {
    MuiIconButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: ({ theme: _theme }) => ({
            color: "inherit",
            border: `1px solid`,
            borderRadius: 4,
            padding: `calc(${_theme.spacing(1)} - 4px)}`,
          }),
        },
      ],
    },
  },
});

export const responsiveTheme = responsiveFontSizes(theme);
