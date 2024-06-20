"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { toSnake } from "convert-keys";
import { Help } from "@mui/icons-material";
import { isNullOrUndefined } from "@survey-tool/core";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import { useHospitalSearch } from "../../hospitals/use-hospital-search";
import { departmentOptions } from "../../hospitals/department-options";
import { employmentTypeOptions } from "../../hospitals/employment-type-options";
import {
  DBUserValidation,
  UserProfile,
  UserValidation,
} from "../../users/types";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { asPostgresError } from "../../errors/postgres-error";
import { parseError } from "../../errors/parse-error";
import { Hospital } from "../../hospitals/types";
import { useUserValidationData } from "../../users/use-user-validation-data";
import { saveUserProfile as coreSaveUserProfile } from "../../users/user-profiles";

import styles from "./styles.module.css";

export default function Page() {
  const { userSession, userId } = useUserSession();
  const userProfile = useUserProfile(userId);
  const { userValidation, userValidationLoaded } =
    useUserValidationData(userId);
  const [locationSearchText, setLocationSearchText] = useState<string>("");
  const [location, setLocation] = useState<Hospital | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [npiNumber, setNpiNumber] = useState<string | null>(null);
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
    () =>
      !userSession.loggedIn ||
      !userProfile ||
      !userValidationLoaded ||
      !dbClient.clientLoaded,
    [
      dbClient.clientLoaded,
      userProfile,
      userSession.loggedIn,
      userValidationLoaded,
    ],
  );

  const userValidationSection = useMemo(() => {
    return loading || userProfile?.validatedTimestamp ? null : (
      <TextField
        className={styles.input}
        type="number"
        label="NPI Number"
        value={npiNumber ?? ""}
        onChange={(event) => setNpiNumber(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Why is NPI being asked for? Click here for more details.">
                <Link href="/faq?expandedTab=why-npi" target="__blank">
                  <Help className={styles.helpIcon} />
                </Link>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    );
  }, [loading, userProfile?.validatedTimestamp, npiNumber]);

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

  useEffect(() => {
    if (userValidation?.npiNumber) {
      setNpiNumber(userValidation.npiNumber);
    }
  }, [userValidation]);

  const getValidatedUserId = useCallback(() => {
    if (!userId) {
      throw new Error("User unknown; cannot save profile without user ID");
    }
    return userId;
  }, [userId]);

  const getLoadedDBClient = useCallback(() => {
    if (!dbClient.clientLoaded) {
      throw new Error("Supabase client not loaded. Cannot save to database");
    }
    return dbClient.client;
  }, [dbClient]);

  const saveUserValidation = useCallback(async () => {
    if (!userSession.loggedIn) {
      throw new Error("User not logged in; cannot save profile");
    }
    if (isNullOrUndefined(userSession.user.email)) {
      throw new Error(
        "User does not have an associated email; cannot save profile",
      );
    }
    const updatedUserValidation: UserValidation = {
      userId: getValidatedUserId(),
      emailAddress: userSession.user.email,
      npiNumber: npiNumber ?? undefined,
      submittedTimestamp: new Date(),
    };
    const loadedDbClient = getLoadedDBClient();
    const dbUserValidation = toSnake<DBUserValidation>(updatedUserValidation);
    const validationSaveResult = await loadedDbClient
      .from("user_validation")
      .upsert(dbUserValidation);
    if (validationSaveResult.error) {
      throw asPostgresError(validationSaveResult.error);
    }
  }, [getLoadedDBClient, getValidatedUserId, npiNumber, userSession]);

  const saveUserProfile = useCallback(async () => {
    const validatedUserId = getValidatedUserId();

    const updatedProfile: UserProfile = {
      userId: validatedUserId,
      location: location?.id ?? undefined,
      department: department ?? undefined,
      employmentType: employmentType ?? undefined,
    };
    await coreSaveUserProfile(getLoadedDBClient(), updatedProfile);
  }, [
    department,
    employmentType,
    getLoadedDBClient,
    getValidatedUserId,
    location?.id,
  ]);

  const saveAllChanges = useCallback(async () => {
    try {
      // User profile must be saved before validation due to foreign key constraint
      await saveUserProfile();
      await saveUserValidation();
      toast("Profile saved successfully", { type: "success" });
    } catch (err: unknown) {
      toast(parseError(err), { type: "error" });
    }
  }, [saveUserProfile, saveUserValidation]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography className={layoutStyles.centeredText} variant="h2">
        Your profile
      </Typography>
      <Autocomplete
        className={styles.input}
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
      {userValidationSection}
      <Button
        className={buttonStyles.button}
        variant="contained"
        onClick={saveAllChanges}
      >
        Save
      </Button>
      <Typography variant="body1">
        Is something missing from our hospital or department lists? Let us know
        by{" "}
        <a href="https://github.com/cohuebn/survey-tool/issues" target="_blank">
          filing a new issue here
        </a>
      </Typography>
    </div>
  );
}
