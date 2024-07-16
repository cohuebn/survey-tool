import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";

import { useHospitalSearch } from "./use-hospital-search";
import { Hospital } from "./types";
import styles from "./hospital-autocomplete.module.css";

type HospitalAutocompleteProps = {
  className?: string;
  initialHospital?: Hospital | null;
  onChange?: (hospital: Hospital | null) => void;
};

export function HospitalAutocomplete({
  className,
  initialHospital,
  onChange,
}: HospitalAutocompleteProps) {
  const [locationSearchText, setLocationSearchText] = useState<string>("");
  const [location, setLocation] = useState<Hospital | null>(null);
  const { loading: hospitalsLoading, searchResults: matchedHospitals } =
    useHospitalSearch(locationSearchText, 500);

  const hospitalOptions = useMemo(() => {
    if (!initialHospital) return matchedHospitals;
    const currentHospitalInOptions = matchedHospitals
      .map((hospital) => hospital.id)
      .includes(initialHospital?.id);
    return currentHospitalInOptions
      ? matchedHospitals
      : [...matchedHospitals, initialHospital];
  }, [matchedHospitals, initialHospital]);

  useEffect(() => {
    setLocation(initialHospital ?? null);
  }, [initialHospital]);

  return (
    <Autocomplete
      className={className}
      autoFocus
      loading={hospitalsLoading}
      options={hospitalOptions}
      noOptionsText={
        location ? "No matching locations found" : "Search for your location"
      }
      filterOptions={(x) => x} // Use only the server-side filter
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      value={location}
      onChange={(_, newValue) => {
        setLocation(newValue);
        setLocationSearchText(newValue?.name ?? "");
        onChange?.(newValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          value={locationSearchText}
          onChange={(event) => setLocationSearchText(event.target.value)}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li
            {...props}
            key={`${option.id}-${option.city}-${option.state}`}
            className={styles.locationAutocompleteOption}
          >
            {option.name}
            <Typography variant="caption">
              {option.city}, {option.state}
            </Typography>
          </li>
        );
      }}
    />
  );
}
