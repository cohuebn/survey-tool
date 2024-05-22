"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@survey-tool/core";
import {
  SupabaseConfig,
  getLazyLoadedSupabaseClient,
} from "@survey-tool/supabase";
import { ReactNode, createContext, useEffect, useState } from "react";

const logger = createLogger("supabase-app-context");

/** Get a Firebase app using config from the API */
async function getSupabaseClient() {
  logger.debug("Getting Supabase app using config from API");
  const configResponse = await fetch("/api/config");
  const config: SupabaseConfig = await configResponse.json();
  return getLazyLoadedSupabaseClient(config);
}

export const SupabaseContext = createContext<SupabaseClient | null>(null);

type SupabaseAppProviderProps = {
  children: ReactNode;
};

export const SupabaseContextProvider = ({
  children,
}: SupabaseAppProviderProps) => {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null,
  );

  useEffect(() => {
    getSupabaseClient().then(setSupabaseClient);
  }, []);

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
};
