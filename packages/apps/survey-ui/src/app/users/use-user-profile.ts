import { useEffect, useMemo, useState } from "react";
import { UserProfile } from "firebase/auth";

import { useUserSession } from "../auth/use-user-session";
import { useSupabaseDb } from "../supabase/use-supabase-db";

type DBUser = {
  user_id: string;
  validated_timestamp: Date;
};

function dbUserToUserProfile(
  userId: string,
  dbUser: DBUser | null,
): UserProfile | null {
  return {
    userId,
    validatedTimestamp: dbUser?.validated_timestamp,
  };
}

export function useUserProfile() {
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
        .select()
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
