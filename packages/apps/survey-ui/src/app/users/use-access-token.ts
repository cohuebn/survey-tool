import { useEffect, useState } from "react";

import { useSupabaseAuth } from "../supabase/use-supabase-auth";

/** Get the access token of the currently logged in user */
export function useAccessToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenLoaded, setAccessTokenLoaded] = useState(false);
  const auth = useSupabaseAuth();

  useEffect(() => {
    if (!auth.clientLoaded) return;
    const authClient = auth.auth;
    authClient.getSession().then(({ data, error }) => {
      if (error) throw error;
      setAccessToken(data.session?.access_token ?? null);
      setAccessTokenLoaded(true);
    });
  });

  return { accessToken, accessTokenLoaded };
}
