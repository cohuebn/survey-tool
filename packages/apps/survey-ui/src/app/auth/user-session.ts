import { Session, User } from "@supabase/supabase-js";

type UnauthenticatedUserSession = {
  loggedIn: false;
};

export type LoggedInUserSession = {
  loggedIn: true;
  user: User;
  session: Session;
};

export type UserSession = UnauthenticatedUserSession | LoggedInUserSession;

export const unauthenticatedUserSession: UnauthenticatedUserSession = {
  loggedIn: false,
};

export function toUserSession(
  user: User,
  session: Session,
): LoggedInUserSession {
  return { loggedIn: true, user, session };
}
