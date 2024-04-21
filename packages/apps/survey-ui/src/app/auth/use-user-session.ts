"use client";

import { useContext, useEffect } from "react";
import { createLogger } from "@survey-tool/core";

import { UserSessionContext } from "./user-session-context";

const logger = createLogger("use-user-session");

export function useUserSession() {
  const userSession = useContext(UserSessionContext);
  useEffect(() => {
    logger.debug({ email: userSession.user?.email }, "Loaded user session");
  }, [userSession]);
  return userSession;
}
