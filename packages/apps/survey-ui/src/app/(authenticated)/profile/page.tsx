"use client";

import {
  Box,
  CircularProgress,
  Divider,
  Fab,
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
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Add, Help, Save } from "@mui/icons-material";
import { isNotNullOrUndefined, isNullOrUndefined } from "@survey-tool/core";
import clsx from "clsx";
import compare from "just-compare";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import {
  PhysicianRole as PhysicianRoleModel,
  UserProfile,
  UserValidation,
} from "../../users/types";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { parseError } from "../../errors/parse-error";
import { Hospital } from "../../hospitals/types";
import { useUserValidationData } from "../../users/use-user-validation-data";
import { saveUserProfile as coreSaveUserProfile } from "../../users/user-profiles";
import { saveUserSettings as coreSaveUserSettings } from "../../user-settings/database";
import { useUserSettings } from "../../user-settings/use-user-settings";
import { saveUserValidation as coreSaveUserValidation } from "../../users/user-validation";
import { usePhysicianRoles } from "../../users/use-physician-roles";

import styles from "./styles.module.css";
import { PhysicianRole } from "./physician-role";

export default function Page() {
  const { userSession, userId } = useUserSession();
  const userProfile = useUserProfile(userId);
  const { userValidation, userValidationLoaded } =
    useUserValidationData(userId);
  const { userSettings, userSettingsLoaded } = useUserSettings(userId);
  const { physicianRoles: existingPhysicianRoles, physicianRolesLoaded } =
    usePhysicianRoles(userId);
  const [location, setLocation] = useState<Hospital | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [npiNumber, setNpiNumber] = useState<string | null>(null);
  const [physicianRoles, setPhysicianRoles] = useState<PhysicianRoleModel[]>(
    [],
  );
  const [autoAdvance, setAutoAdvance] = useState(true);

  const dbClient = useSupabaseDb();

  const loading = useMemo(
    () =>
      !userSession.loggedIn ||
      !userProfile ||
      !userValidationLoaded ||
      !dbClient.clientLoaded ||
      !userSettingsLoaded ||
      !physicianRolesLoaded,
    [
      dbClient.clientLoaded,
      userProfile,
      userSession.loggedIn,
      userValidationLoaded,
      userSettingsLoaded,
      physicianRolesLoaded,
    ],
  );

  const userValidationSection = useMemo(() => {
    return loading ||
      isNotNullOrUndefined(userProfile?.validatedTimestamp) ? null : (
      <Box className={styles.settingsSection}>
        <Typography variant="h3" className={styles.subheader}>
          Validation
        </Typography>
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
      </Box>
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

  useEffect(() => {
    if (!compare(physicianRoles, existingPhysicianRoles)) {
      setPhysicianRoles(existingPhysicianRoles);
    }
    // We only want initial database loading of physician roles; don't reload them
    // when they differ from the existing roles or that'd cause live changes to
    // be overwritten
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physicianRolesLoaded]);

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

  const addPhysicianRole = () => {
    const newRole: PhysicianRoleModel = {
      userId: getValidatedUserId(),
      createdTimestamp: new Date(),
    };
    const updatedRoles = [...physicianRoles, newRole];
    setPhysicianRoles(updatedRoles);
  };

  const deleteRole = (roleIndex: number) => {
    const updatedRoles = physicianRoles.filter(
      (_, index) => index !== roleIndex,
    );
    setPhysicianRoles(updatedRoles);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={clsx(layoutStyles.centeredContent)}>
      <Typography className={layoutStyles.centeredText} variant="h2">
        Your profile
      </Typography>
      <div className={styles.profile}>
        {userValidationSection}
        <Box className={styles.settingsSection}>
          <Typography
            className={clsx(layoutStyles.centeredText, styles.subheader)}
            variant="h3"
          >
            Survey Settings
          </Typography>
          <div className={styles.autoAdvanceSetting}>
            <Tooltip
              title={
                <Typography variant="body1">
                  If enabled, some question types (single-choice, rating, etc.)
                  will automatically progress after an answer is selected. When
                  this setting is disabled, you just need to explicitly hit the
                  Next button after selecting a choice. If using a screen reader
                  or other accessibility device, disabling this setting is
                  recommended.
                </Typography>
              }
            >
              <FormControlLabel
                control={
                  <Switch
                    id="auto-advance-switch"
                    checked={autoAdvance}
                    onChange={(event) => setAutoAdvance(event.target.checked)}
                  />
                }
                label="Auto-advance to next question when question supports it?"
              />
            </Tooltip>
          </div>
        </Box>
        <Box className={styles.settingsSection}>
          <Typography
            className={clsx(layoutStyles.centeredText, styles.subheader)}
            variant="h3"
          >
            Roles
          </Typography>
          {physicianRoles.map((role, index) => (
            <Fragment key={`physician-role-section-${index}`}>
              <PhysicianRole
                initialHospital={role.hospital}
                department={role.department}
                employmentType={role.employmentType}
                roleIndex={index}
                onHospitalChange={() => {}}
                onDepartmentChange={() => {}}
                onEmploymentTypeChange={() => {}}
                onDelete={() => deleteRole(index)}
              />
              <Divider />
            </Fragment>
          ))}
          <div className={clsx("buttonGroup", layoutStyles.centeredContent)}>
            <Fab
              variant="extended"
              color="secondary"
              className={buttonStyles.actionButton}
              onClick={() => addPhysicianRole()}
            >
              <Add className={buttonStyles.actionButtonIcon} />
              Add another role
            </Fab>
          </div>
          <Typography variant="body1">
            Is something missing from our hospital or department lists? Let us
            know by{" "}
            <a
              href="https://github.com/cohuebn/survey-tool/issues"
              target="_blank"
            >
              filing a new issue here
            </a>
          </Typography>
        </Box>
      </div>
      <div className="buttonGroup">
        <Fab
          variant="extended"
          color="primary"
          className={buttonStyles.actionButton}
          onClick={saveAllChanges}
        >
          <Save className={buttonStyles.actionButtonIcon} />
          Save
        </Fab>
      </div>
    </div>
  );
}

// {
//   /* <HospitalAutocomplete
//         initialHospital={initialHospital}
//         className={styles.input}
//         onChange={setLocation}
//       />
//       <DepartmentAutocomplete
//         className={styles.input}
//         initialDepartment={department}
//         onChange={setDepartment}
//       />
//       <Autocomplete
//         value={employmentType}
//         onChange={(_, newValue) => setEmploymentType(newValue)}
//         options={employmentTypeOptions}
//         className={styles.input}
//         renderInput={(params) => (
//           <TextField {...params} label="Employment type" />
//         )}
//       /> */
// }
