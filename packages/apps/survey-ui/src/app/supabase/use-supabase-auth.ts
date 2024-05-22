import { useContext } from "react";
import { isNullOrUndefined } from "@survey-tool/core";
import { SupabaseClient } from "@supabase/supabase-js";

import { SupabaseContext } from "./supabase-context";

type SupabaseLoadingResult = {
  clientLoaded: false;
};

type SupabaseLoadedResult = {
  clientLoaded: true;
  auth: SupabaseClient["auth"];
};

type UseSupabaseAuthResult = SupabaseLoadingResult | SupabaseLoadedResult;

/**
 * Get an easier to use Supabase auth client. This client is in one of two states:
 * 1. Loading: If the Supabase client hasn't loaded yet, it will be in a loading state without access to auth methods.
 * 2. Loaded: If the Supabase client has loaded, it will have access to all auth methods (e.g. signUp, signOut, etc.)
 */
export function useSupabaseAuth(): UseSupabaseAuthResult {
  const supabaseClient = useContext(SupabaseContext);
  return isNullOrUndefined(supabaseClient)
    ? { clientLoaded: false }
    : {
        clientLoaded: true,
        auth: supabaseClient.auth,
      };
}
