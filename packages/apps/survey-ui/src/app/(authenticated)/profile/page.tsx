"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { toSnake } from "convert-keys";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import { useHospitalSearch } from "../../hospitals/use-hospital-search";
import { departmentOptions } from "../../hospitals/department-options";
import { employmentTypeOptions } from "../../hospitals/employment-type-options";
import { DBUser, User } from "../../users/types";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { asPostgresError } from "../../errors/postgres-error";
import { parseError } from "../../errors/parse-error";
import { Hospital } from "../../hospitals/types";

import styles from "./styles.module.css";

export default function Page() {
  const { userSession } = useUserSession();
  const userProfile = useUserProfile();
  const [locationSearchText, setLocationSearchText] = useState<string>("");
  const [location, setLocation] = useState<Hospital | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const { loading: hospitalsLoading, searchResults: matchedHospitals } =
    useHospitalSearch(locationSearchText, 500);
  const [initialHospital, setInitialHospital] = useState<Hospital | null>(null);

  const hospitalOptions = useMemo(() => {
    if (!initialHospital) return matchedHospitals;
    const currentHospitalInOptions = matchedHospitals
      .map((hospital) => hospital.id)
      .includes(initialHospital?.id);
    return currentHospitalInOptions
      ? matchedHospitals
      : [...matchedHospitals, initialHospital];
  }, [matchedHospitals, initialHospital]);

  const dbClient = useSupabaseDb();

  const loading = useMemo(
    () => !userSession.loggedIn || !userProfile || !dbClient.clientLoaded,
    [dbClient.clientLoaded, userProfile, userSession.loggedIn],
  );

  useEffect(() => {
    if (userProfile?.department) {
      setDepartment(userProfile?.department);
    }
    if (userProfile?.employmentType) {
      setEmploymentType(userProfile?.employmentType);
    }
    const loadedLocation = userProfile?.hospitals;
    if (loadedLocation) {
      setInitialHospital(loadedLocation);
      setLocation(loadedLocation);
    }
  }, [userProfile]);

  const saveUserProfile = useCallback(async () => {
    const userId = userProfile?.userId;
    if (!userId) {
      throw new Error("User unknown; cannot save profile without user ID");
    }

    const updatedProfile: User = {
      userId,
      location: location?.id ?? undefined,
      department: department ?? undefined,
      employmentType: employmentType ?? undefined,
    };
    if (!dbClient.clientLoaded) {
      throw new Error("Supabase client not loaded. Cannot save to database");
    }
    try {
      const dbUserProfile = toSnake<DBUser>(updatedProfile);
      const result = await dbClient.client.from("users").upsert(dbUserProfile);
      if (result.error) throw asPostgresError(result.error);
      toast("Profile saved successfully", { type: "success" });
    } catch (err: unknown) {
      toast(parseError(err), { type: "error" });
    }
  }, [dbClient, department, employmentType, location, userProfile]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography className={styles.header} variant="h2">
        Your profile
      </Typography>
      <Autocomplete
        className={styles.input}
        autoFocus
        loading={hospitalsLoading}
        options={hospitalOptions}
        noOptionsText={
          location ? "No hospitals found" : "Search for your hospital"
        }
        filterOptions={(x) => x} // Use only the server-side filter
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        value={location}
        onChange={(_, newValue) => {
          setLocation(newValue);
          setLocationSearchText(newValue?.name ?? "");
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
      <Autocomplete
        freeSolo
        className={styles.input}
        autoFocus
        autoHighlight
        options={departmentOptions}
        value={department}
        onChange={(_, newValue) => setDepartment(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Department" value={department} />
        )}
      />

      <Autocomplete
        value={employmentType}
        onChange={(_, newValue) => setEmploymentType(newValue)}
        options={employmentTypeOptions}
        className={styles.input}
        renderInput={(params) => (
          <TextField {...params} label="Employment type" />
        )}
      />
      <Button
        className={buttonStyles.button}
        variant="contained"
        onClick={saveUserProfile}
      >
        Save
      </Button>

      <Typography variant="body1">
        Is something missing from our hospital or department lists? Let us know
        by{" "}
        <a href="https://github.com/cohuebn/survey-tool/issues">
          filing a new issue here
        </a>
      </Typography>
    </div>
  );
}
