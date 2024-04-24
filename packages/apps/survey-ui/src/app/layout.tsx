import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Lato } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./global.css";

import { FavIcons } from "./favicons";
import { responsiveTheme } from "./theme";
import { FirebaseAppProvider } from "./firebase/firebase-app-context";
import { UserSessionContextProvider } from "./auth/user-session-context-provider";

const latoFont = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <FavIcons />
        <title>DocVoice</title>
      </head>
      <body className={latoFont.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={responsiveTheme}>
            <FirebaseAppProvider>
              <UserSessionContextProvider>
                {children}
              </UserSessionContextProvider>
              <ToastContainer position="bottom-left" />
            </FirebaseAppProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
