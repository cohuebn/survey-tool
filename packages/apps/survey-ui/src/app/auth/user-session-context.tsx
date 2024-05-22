"use client";

import { createContext } from "react";

import { UserSession, unauthenticatedUserSession } from "./user-session";

type UserSessionContextData = {
  userSession: UserSession;
  setUserSession: (user: UserSession) => void;
  removeUserSession: () => void;
};

/**
 * A sharable context containing:
 * 1. The currently authenticated user (if any)
 * 2. A function to set the authenticated user
 * 3. A function to remove the authenticated user
 */
export const UserSessionContext = createContext<UserSessionContextData>({
  userSession: unauthenticatedUserSession,
  setUserSession: () => {},
  removeUserSession: () => {},
});
