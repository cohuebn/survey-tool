import { useMemo } from "react";

import { SurveySummary } from "../types";

export function useFilteredSurveys(
  allSurveys: SurveySummary[],
  searchText: string,
): SurveySummary[] {
  // TODO - move this to the API, add more sophisticated permissioned search
  return useMemo(() => {
    const normalizedSearch = searchText.toLowerCase();
    if (!normalizedSearch) return allSurveys;

    return allSurveys.filter(
      (survey) =>
        survey.name.toLocaleLowerCase().includes(normalizedSearch) ||
        survey.subtitle?.toLocaleLowerCase().includes(normalizedSearch) ||
        survey.description?.toLocaleLowerCase().includes(normalizedSearch),
    );
  }, [allSurveys, searchText]);
}
