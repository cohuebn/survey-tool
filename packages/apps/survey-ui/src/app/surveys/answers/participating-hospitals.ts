import { DBParticipatingHospital, ParticipatingHospital } from "../types";

/**
 * Convert a raw db result for a participating hospital to the in-app object representing
 * that participating hospital
 */
export function toParticipatingHospital(
  dbResult: DBParticipatingHospital,
): ParticipatingHospital {
  return {
    hospital: {
      id: dbResult.location_id,
      name: dbResult.hospital_name,
      city: dbResult.hospital_city,
      state: dbResult.hospital_state,
    },
    participantCount: dbResult.participant_count,
  };
}
