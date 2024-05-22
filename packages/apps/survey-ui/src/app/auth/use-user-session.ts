"use client";

import { useContext, useEffect } from "react";
import { createLogger } from "@survey-tool/core";

import { UserSessionContext } from "./user-session-context";

const logger = createLogger("use-user-session");

export function useUserSession() {
  const userSessionContext = useContext(UserSessionContext);
  useEffect(() => {
    if (userSessionContext.userSession.loggedIn) {
      logger.debug(
        { email: userSessionContext.userSession.user.email },
        "Loaded user session",
      );
    } else {
      logger.debug("No user session found");
    }
  }, [userSessionContext]);
  return userSessionContext;
}
