import { useMemo } from "react";

import { useUserSession } from "./use-user-session";

/** Get the currently logged in user's id */
export function useUserId(): string | undefined {
  const userSession = useUserSession();
  return useMemo(
    () =>
      userSession.userSession.loggedIn
        ? userSession.userSession.user.id
        : undefined,
    [userSession.userSession],
  );
}
