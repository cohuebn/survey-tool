import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Lato } from "next/font/google";

import "./global.css";

import { FavIcons } from "./favicons";
import { responsiveTheme } from "./theme";

const latoFont = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <FavIcons />
      </head>
      <body className={latoFont.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={responsiveTheme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
