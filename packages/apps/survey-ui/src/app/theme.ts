"use client";

import { Lato } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const lato = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

const colors = {
  primary: "#4789B2",
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: lato.style.fontFamily,
  },
});
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
