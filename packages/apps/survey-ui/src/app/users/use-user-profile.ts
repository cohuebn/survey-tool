import { useEffect, useState } from "react";

import { useSupabaseDb } from "../supabase/use-supabase-db";

import { User } from "./types";
import { getUserProfile } from "./user-profiles";

export function useUserProfile(userId: string | undefined) {
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    setUserProfileLoaded(false);
    setUserProfile(null);
  }, [userId]);

  useEffect(() => {
    if (userProfileLoaded) return;
    if (!userId || !supabaseDb.clientLoaded) {
      setUserProfile(null);
    } else {
      getUserProfile(supabaseDb.client, userId).then((loadedProfile) => {
        setUserProfile(loadedProfile);
        setUserProfileLoaded(true);
      });
    }
  }, [userId, supabaseDb, userProfileLoaded]);

  return userProfile;
}
