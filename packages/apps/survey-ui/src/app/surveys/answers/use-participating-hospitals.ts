import { useEffect, useState } from "react";

import { ParticipatingHospital } from "../types";

export const revalidate = 60;

type HookResult = {
  participatingHospitals: ParticipatingHospital[];
  participatingHospitalsLoaded: boolean;
};

async function fetchParticipatingHospitals(
  surveyId: string,
): Promise<ParticipatingHospital[]> {
  const response = await fetch(
    `/api/surveys/${surveyId}/participating-hospitals`,
  );
  return response.json();
}

/** A hook to get all hospitals with at least one participant in the given survey */
export function useParticipatingHospitals(surveyId: string): HookResult {
  const [participatingHospitals, setParticipatingHospitals] = useState<
    ParticipatingHospital[]
  >([]);
  const [participatingHospitalsLoaded, setParticipatingHospitalsLoaded] =
    useState(false);

  useEffect(() => {
    setParticipatingHospitalsLoaded(false);
    fetchParticipatingHospitals(surveyId).then((result) => {
      setParticipatingHospitals(result);
      setParticipatingHospitalsLoaded(true);
    });
  }, [surveyId]);

  return { participatingHospitals, participatingHospitalsLoaded };
}
