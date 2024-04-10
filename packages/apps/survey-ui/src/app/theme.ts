"use client";

import { Lato } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily,
  },
});

export default theme;
