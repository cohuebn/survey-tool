"use client";

import { Lato } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const lato = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily,
  },
});
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
