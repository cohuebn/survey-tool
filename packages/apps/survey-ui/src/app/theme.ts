"use client";

import { Lato } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import { colors } from "./tokens";

const latoFont = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: latoFont.style.fontFamily,
  },
});
export const responsiveTheme = responsiveFontSizes(theme);
