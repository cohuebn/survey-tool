import { useEffect, useMemo, useState } from "react";
import { createLogger } from "@survey-tool/core";
import { useDebounce } from "use-debounce";

import { Hospital } from "./types";

const logger = createLogger("useHospitalSearch");

type UseHospitalSearchResults = {
  searchResults: Hospital[];
};

function isTermMatched(value: string, term: string): boolean {
  return value.toLowerCase().includes(term.toLowerCase());
}

function isHospitalMatched(hospital: Hospital, searchTerms: string[]): boolean {
  return searchTerms.every((term) => {
    return (
      isTermMatched(hospital.name, term) ||
      isTermMatched(hospital.city, term) ||
      isTermMatched(hospital.state, term)
    );
  });
}

/** Use the hospital search function on a subset of hospitals */
export function useRestrictedHospitalSearch(
  hospitals: Hospital[],
  searchTerm: string | null,
  debounceTime: number = 0,
): UseHospitalSearchResults {
  const [debouncedSearchTerm] = useDebounce(searchTerm ?? "", debounceTime);
  const [searchResults, setSearchResults] = useState<Hospital[]>([]);

  const parsedSearchTerms = useMemo(() => {
    return debouncedSearchTerm.trim().split(/\s+/g);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!parsedSearchTerms?.length) {
      logger.debug("Empty search term, returning all hospitals");
      setSearchResults(hospitals);
      return;
    }

    logger.debug({ parsedSearchTerm: parsedSearchTerms }, "Running search");

    const matchedHospitals = hospitals.filter((hospital) =>
      isHospitalMatched(hospital, parsedSearchTerms),
    );
    setSearchResults(matchedHospitals);
  }, [hospitals, parsedSearchTerms]);

  return { searchResults };
}
