import { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

import { useSupabaseDb } from "./use-supabase-db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomDataRetrieverArgs = Array<any>;
type DataRetrieverArgs<
  TCustomDataRetrieverArgs extends CustomDataRetrieverArgs,
> = [SupabaseClient, ...TCustomDataRetrieverArgs];
type DataRetreiver<
  TCustomDataRetrieverArgs extends CustomDataRetrieverArgs,
  TInput extends DataRetrieverArgs<TCustomDataRetrieverArgs>,
  TOutput,
> = (...input: TInput) => Promise<TOutput>;

/**
 * A generic hook that can be used to run a Supabase query whenever inputs
 * change. This hook takes in a data retriever function that
 * will run when the Supabase client is loaded or the inputs change.
 * @param dataRetriever The function that will be called to retrieve data from the database
 * @param inputs The inputs to the data retriever function
 * @param defaultValue The default value to return before the data is loaded
 */
export function useSupabaseQueryResult<
  TCustomDataRetrieverArgs extends CustomDataRetrieverArgs,
  TOutput,
>(
  dataRetriever: DataRetreiver<
    TCustomDataRetrieverArgs,
    DataRetrieverArgs<TCustomDataRetrieverArgs>,
    TOutput
  >,
  inputs: TCustomDataRetrieverArgs,
  defaultValue: TOutput,
) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<TOutput>(defaultValue);
  const supabaseDb = useSupabaseDb();

  const boundDataRetriever = useCallback(() => {
    if (!supabaseDb.clientLoaded) {
      throw new Error("Supabase client not loaded. Cannot retrieve data");
    }
    return dataRetriever(supabaseDb.client, ...inputs);
  }, [dataRetriever, inputs, supabaseDb]);

  useEffect(() => {
    if (dataLoaded) return;
    if (!supabaseDb.clientLoaded) return;

    // eslint-disable-next-line no-console
    console.log("Running query");
    boundDataRetriever().then((loadedLocationRestrictions) => {
      setData(loadedLocationRestrictions);
      setDataLoaded(true);
    });
  }, [boundDataRetriever, dataLoaded, supabaseDb]);

  return {
    data,
    dataLoaded,
  };
}
