import { useEffect, useMemo, useState } from "react";
import { toCamel } from "convert-keys";

import { useUserSession } from "../auth/use-user-session";
import { useSupabaseDb } from "../supabase/use-supabase-db";

import { DBUser, User } from "./types";

function dbUserToUserProfile(
  userId: string,
  dbUser: DBUser | null,
): User | null {
  return toCamel({ ...dbUser, userId });
}

export function useUserProfile() {
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const userSession = useUserSession();
  const supabaseDb = useSupabaseDb();

  const userId = useMemo(
    () =>
      userSession.userSession.loggedIn
        ? userSession.userSession.user.id
        : undefined,
    [userSession.userSession],
  );

  useEffect(() => {
    setUserProfileLoaded(false);
    setUserProfile(null);
  }, [userId]);

  useEffect(() => {
    if (userProfileLoaded) return;
    if (!userId || !supabaseDb.clientLoaded) {
      setUserProfile(null);
    } else {
      supabaseDb.client
        .from("users")
        .select(
          `
          user_id,
          validated_timestamp,
          location,
          hospitals(id, name, city, state),
          department,
          employment_type
        `,
        )
        .eq("user_id", userId)
        .maybeSingle<DBUser>()
        .then((dbResult) => {
          const loadedProfile = dbUserToUserProfile(userId, dbResult.data);
          setUserProfile(loadedProfile);
          setUserProfileLoaded(true);
        });
    }
  }, [userId, supabaseDb, userProfileLoaded]);

  return userProfile;
}
