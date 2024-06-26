import { useEffect, useMemo, useState } from "react";
import { toCamel } from "convert-keys";
import { createLogger } from "@survey-tool/core";
import { useDebounce } from "use-debounce";

import { useSupabaseDb } from "../supabase/use-supabase-db";
import { asPostgresError } from "../errors/postgres-error";

import { DBHospital, Hospital } from "./types";

const logger = createLogger("useHospitalSearch");

type UseHospitalSearchResults = {
  loading: boolean;
  searchResults: Hospital[];
};

export function useHospitalSearch(
  searchTerm: string | null,
  debounceTime: number = 0,
): UseHospitalSearchResults {
  const db = useSupabaseDb();
  const [debouncedSearchTerm] = useDebounce(searchTerm ?? "", debounceTime);
  const [searchResults, setSearchResults] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  const parsedSearchTerm = useMemo(() => {
    return debouncedSearchTerm.trim().split(/\s+/g).join(" & ");
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!db.clientLoaded) {
      logger.debug("Supabase client not loaded, skipping search");
      return;
    }
    if (!parsedSearchTerm) {
      logger.debug("Empty search term, skipping search");
      if (searchResults.length) setSearchResults([]);
      return;
    }

    logger.debug({ parsedSearchTerm }, "Running search");
    setLoading(true);
    db.client
      .rpc("search_hospitals", { search_term: parsedSearchTerm })
      .then((result) => {
        setLoading(false);
        if (result.error) throw asPostgresError(result.error);
        const dbHospitals: DBHospital[] = result.data;
        const hospitals = dbHospitals.map((dbHospital) =>
          toCamel<Hospital>(dbHospital),
        );
        setSearchResults(hospitals);
      });
  }, [db, parsedSearchTerm, searchResults.length]);

  return { loading, searchResults };
}
