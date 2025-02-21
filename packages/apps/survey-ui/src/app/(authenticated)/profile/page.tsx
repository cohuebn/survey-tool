"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Link,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Help } from "@mui/icons-material";
import { isNotNullOrUndefined, isNullOrUndefined } from "@survey-tool/core";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import { employmentTypeOptions } from "../../hospitals/employment-type-options";
import { UserProfile, UserValidation } from "../../users/types";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { parseError } from "../../errors/parse-error";
import { Hospital } from "../../hospitals/types";
import { useUserValidationData } from "../../users/use-user-validation-data";
import { saveUserProfile as coreSaveUserProfile } from "../../users/user-profiles";
import { HospitalAutocomplete } from "../../hospitals/hospital-autocomplete";
import { DepartmentAutocomplete } from "../../hospitals/department-autocomplete";
import { saveUserSettings as coreSaveUserSettings } from "../../user-settings/database";
import { useUserSettings } from "../../user-settings/use-user-settings";
import { saveUserValidation as coreSaveUserValidation } from "../../users/user-validation";

import styles from "./styles.module.css";

export default function Page() {
  const { userSession, userId } = useUserSession();
  const userProfile = useUserProfile(userId);
  const { userValidation, userValidationLoaded } =
    useUserValidationData(userId);
  const { userSettings, userSettingsLoaded } = useUserSettings(userId);
  const [location, setLocation] = useState<Hospital | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [npiNumber, setNpiNumber] = useState<string | null>(null);
  const [initialHospital, setInitialHospital] = useState<Hospital | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const dbClient = useSupabaseDb();

  const loading = useMemo(
    () =>
      !userSession.loggedIn ||
      !userProfile ||
      !userValidationLoaded ||
      !dbClient.clientLoaded ||
      !userSettingsLoaded,
    [
      dbClient.clientLoaded,
      userProfile,
      userSession.loggedIn,
      userValidationLoaded,
      userSettingsLoaded,
    ],
  );

  const userValidationSection = useMemo(() => {
    return loading ||
      isNotNullOrUndefined(userProfile?.validatedTimestamp) ? null : (
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

  useEffect(() => {
    setAutoAdvance(userSettings.autoAdvance ?? true); // Default auto-advance to true
  }, [userSettings]);

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
    await coreSaveUserValidation(loadedDbClient, updatedUserValidation);
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

  const saveUserSettings = useCallback(async () => {
    const settings = { autoAdvance };
    await coreSaveUserSettings(
      getLoadedDBClient(),
      getValidatedUserId(),
      settings,
    );
  }, [autoAdvance, getLoadedDBClient, getValidatedUserId]);

  const saveAllChanges = useCallback(async () => {
    try {
      // User profile must be saved before validation due to foreign key constraint
      await saveUserProfile();
      await Promise.all([saveUserValidation(), saveUserSettings()]);
      toast("Profile saved successfully", { type: "success" });
    } catch (err: unknown) {
      toast(parseError(err), { type: "error" });
    }
  }, [saveUserProfile, saveUserSettings, saveUserValidation]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography className={layoutStyles.centeredText} variant="h2">
        Your profile
      </Typography>
      <HospitalAutocomplete
        initialHospital={initialHospital}
        className={styles.input}
        onChange={setLocation}
      />
      <DepartmentAutocomplete
        className={styles.input}
        initialDepartment={department}
        onChange={setDepartment}
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
      <Box className={styles.inputContainer}>
        <div className={layoutStyles.centeredText}>Additional Roles</div>
      </Box>
      <div className={styles.autoAdvanceSetting}>
        <Tooltip
          title={
            <Typography variant="body1">
              If enabled, some question types (single-choice, rating, etc.) will
              automatically progress after an answer is selected. When this
              setting is disabled, you just need to explicitly hit the Next
              button after selecting a choice. If using a screen reader or other
              accessibility device, disabling this setting is recommended.
            </Typography>
          }
        >
          <FormControlLabel
            control={
              <Switch
                checked={autoAdvance}
                onChange={(event) => setAutoAdvance(event.target.checked)}
              />
            }
            label="Auto-advance to next question when question supports it?"
          />
        </Tooltip>
      </div>
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
