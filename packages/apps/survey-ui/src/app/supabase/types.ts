import { getSupabaseClient } from "./supabase-context";
import { getServerSideSupabaseClient } from "./supbase-server-side-client";

export type ServerSideSupabaseClient = Awaited<
  ReturnType<typeof getServerSideSupabaseClient>
>;

export type AppSupabaseClient = ReturnType<
  Awaited<ReturnType<typeof getSupabaseClient>>
>;
