"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { UserSessionContext } from "./user-session-context";
import { AuthenticatedUser } from "./authenticated-user";

const sessionStorageKey = "docVoice.user";

function getUserSessionFromStorage(): AuthenticatedUser | null {
  const storedUser = sessionStorage.getItem(sessionStorageKey);
  return storedUser ? JSON.parse(storedUser) : null;
}

type UserSessionContextProps = {
  user: AuthenticatedUser | null;
  userLoaded: boolean;
  setAuthenticatedUser: (user: AuthenticatedUser) => void;
  removeAuthenticatedUser: () => void;
};

/** A context provider that reads/writes authenticated user details to session storage * */
export const UserSessionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userLoaded, setUserLoaded] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    if (!authenticatedUser) {
      const storedUser = getUserSessionFromStorage();
      if (storedUser) {
        setAuthenticatedUser(storedUser);
      }
    }
    setUserLoaded(true);
  }, [authenticatedUser]);

  // External hook to store user in session storage and state
  const setUserInSession = useCallback(
    (_user: AuthenticatedUser) => {
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(_user));
      setAuthenticatedUser(_user);
    },
    [setAuthenticatedUser],
  );

  // External hook to remove user in session storage and state
  const removeUserInSession = useCallback(() => {
    sessionStorage.removeItem(sessionStorageKey);
    setAuthenticatedUser(null);
  }, [setAuthenticatedUser]);

  const userSessionContext: UserSessionContextProps = useMemo(() => {
    return {
      user: authenticatedUser,
      userLoaded,
      setAuthenticatedUser: setUserInSession,
      removeAuthenticatedUser: removeUserInSession,
    };
  }, [authenticatedUser, userLoaded, setUserInSession, removeUserInSession]);

  return (
    <UserSessionContext.Provider value={userSessionContext}>
      {children}
    </UserSessionContext.Provider>
  );
};
