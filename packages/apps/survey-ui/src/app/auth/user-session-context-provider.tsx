"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import {
  UserSessionContext,
  UserSessionContextData,
} from "./user-session-context";
import {
  LoggedInUserSession,
  UserSession,
  unauthenticatedUserSession,
} from "./user-session";

const sessionStorageKey = "docVoice.user";

function getUserSessionFromStorage(): LoggedInUserSession | null {
  const storedUser = sessionStorage.getItem(sessionStorageKey);
  return storedUser ? JSON.parse(storedUser) : null;
}

/** A context provider that reads/writes authenticated user details to session storage * */
export const UserSessionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userSession, setUserSession] = useState<UserSession>(
    unauthenticatedUserSession,
  );

  useEffect(() => {
    if (!userSession.loggedIn) {
      const storedUser = getUserSessionFromStorage();
      if (storedUser) {
        setUserSession(storedUser);
      }
    }
  }, [userSession]);

  // External hook to store user in session storage and state
  const setStoredUserSession = useCallback(
    (_userSession: UserSession) => {
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(_userSession));
      setUserSession(_userSession);
    },
    [setUserSession],
  );

  // External hook to remove user in session storage and state
  const removeStoredUserSession = useCallback(() => {
    sessionStorage.removeItem(sessionStorageKey);
    setUserSession(unauthenticatedUserSession);
  }, [setUserSession]);

  const userSessionContext: UserSessionContextData = useMemo(() => {
    return {
      userSession,
      userId: userSession.loggedIn ? userSession.user.id : undefined,
      email: userSession.loggedIn ? userSession.user.email : undefined,
      setUserSession: setStoredUserSession,
      removeUserSession: removeStoredUserSession,
    };
  }, [userSession, setStoredUserSession, removeStoredUserSession]);

  return (
    <UserSessionContext.Provider value={userSessionContext}>
      {children}
    </UserSessionContext.Provider>
  );
};
