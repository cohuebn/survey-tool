import { User } from "firebase/auth";

export type AuthenticatedUser = User & { accessToken: string };

export function isAuthenticatedUser(
  user: User | null,
): user is AuthenticatedUser {
  return user !== null && "accessToken" in user;
}
