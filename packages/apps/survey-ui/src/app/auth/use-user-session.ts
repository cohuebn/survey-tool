"use client";

import { useContext } from "react";

import { UserSessionContext } from "./user-session-context";

export function useUserSession() {
  return useContext(UserSessionContext);
}
