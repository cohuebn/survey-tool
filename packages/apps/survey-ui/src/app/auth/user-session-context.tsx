"use client";

import { createContext } from "react";

import { AuthenticatedUser } from "./authenticated-user";

type UserSessionContextData = {
  user: AuthenticatedUser | null;
  userLoaded: boolean;
  setAuthenticatedUser: (user: AuthenticatedUser) => void;
  removeAuthenticatedUser: () => void;
};

/**
 * A sharable context containing:
 * 1. The currently authenticated user (if any)
 * 2. A function to set the authenticated user
 * 3. A function to remove the authenticated user
 */
export const UserSessionContext = createContext<UserSessionContextData>({
  user: null,
  userLoaded: true,
  setAuthenticatedUser: () => {},
  removeAuthenticatedUser: () => {},
});
