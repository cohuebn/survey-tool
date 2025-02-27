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
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { toast } from "react-toastify";
import { Add, Help, Save } from "@mui/icons-material";
import { isNotNullOrUndefined, isNullOrUndefined } from "@survey-tool/core";
import clsx from "clsx";
import compare from "just-compare";
import { v4 as uuidV4 } from "uuid";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import {
  PhysicianRole as PhysicianRoleModel,
  UserProfile,
  UserValidation,
} from "../../users/types";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { parseError } from "../../errors/parse-error";
import { useUserValidationData } from "../../users/use-user-validation-data";
import { saveUserProfile as coreSaveUserProfile } from "../../users/user-profiles";
import { saveUserSettings as coreSaveUserSettings } from "../../user-settings/database";
import { useUserSettings } from "../../user-settings/use-user-settings";
import { saveUserValidation as coreSaveUserValidation } from "../../users/user-validation";
import { usePhysicianRoles } from "../../users/use-physician-roles";
import { savePhysicianRoles as coreSavePhysicianRoles } from "../../users/database";

import styles from "./styles.module.css";
import { PhysicianRole } from "./physician-role";
import { physicianRolesReducer } from "./physician-roles-reducer";

export default function Page() {
  const { userSession, userId } = useUserSession();
  const userProfile = useUserProfile(userId);
  const { userValidation, userValidationLoaded } =
    useUserValidationData(userId);
  const { userSettings, userSettingsLoaded } = useUserSettings(userId);
  const { physicianRoles: initialPhysicianRoles, physicianRolesLoaded } =
    usePhysicianRoles(userId);
  const [npiNumber, setNpiNumber] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [physicianRolesState, physicianRolesDispatch] = useReducer(
    physicianRolesReducer,
    {
      physicianRoles: initialPhysicianRoles,
      allRolesValid: true,
    },
  );

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
    if (userValidation?.npiNumber) {
      setNpiNumber(userValidation.npiNumber);
    }
  }, [userValidation]);

  useEffect(() => {
    setAutoAdvance(userSettings.autoAdvance ?? true); // Default auto-advance to true
  }, [userSettings]);

  useEffect(() => {
    if (!compare(physicianRolesState.physicianRoles, initialPhysicianRoles)) {
      physicianRolesDispatch({
        type: "setPhysicianRoles",
        value: initialPhysicianRoles,
      });
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

    const firstPhysicianRole = physicianRolesState.physicianRoles[0];
    const updatedProfile: UserProfile = {
      userId: validatedUserId,
      location: firstPhysicianRole.hospital?.id,
      department: firstPhysicianRole.department,
      employmentType: firstPhysicianRole.employmentType,
    };
    await coreSaveUserProfile(getLoadedDBClient(), updatedProfile);
  }, [
    physicianRolesState.physicianRoles,
    getLoadedDBClient,
    getValidatedUserId,
  ]);

  const saveUserSettings = useCallback(async () => {
    const settings = { autoAdvance };
    await coreSaveUserSettings(
      getLoadedDBClient(),
      getValidatedUserId(),
      settings,
    );
  }, [autoAdvance, getLoadedDBClient, getValidatedUserId]);

  const savePhysicianRoles = useCallback(async () => {
    if (!physicianRolesState.allRolesValid) {
      throw new Error("Cannot save physician roles; some roles are invalid");
    }
    const roles = physicianRolesState.physicianRoles;
    await coreSavePhysicianRoles(getLoadedDBClient(), roles);
  }, [getLoadedDBClient, physicianRolesState]);

  const saveAllChanges = useCallback(async () => {
    try {
      // User profile must be saved before validation due to foreign key constraint
      await saveUserProfile();
      await Promise.all([
        saveUserValidation(),
        saveUserSettings(),
        savePhysicianRoles(),
      ]);
      toast("Profile saved successfully", { type: "success" });
    } catch (err: unknown) {
      toast(parseError(err), { type: "error" });
    }
  }, [
    saveUserProfile,
    saveUserSettings,
    saveUserValidation,
    savePhysicianRoles,
  ]);

  const addNewPhysicianRole = () => {
    const newRole: PhysicianRoleModel = {
      id: uuidV4(),
      userId: getValidatedUserId(),
      createdTimestamp: new Date(),
    };
    physicianRolesDispatch({ type: "addPhysicianRole", value: newRole });
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
          {physicianRolesState.physicianRoles.map((role, index) => (
            <Fragment key={`physician-role-section-${index}`}>
              <PhysicianRole
                roleIndex={index}
                physicianRole={role}
                dispatch={physicianRolesDispatch}
              />
              <Divider />
            </Fragment>
          ))}
          <div className={clsx("buttonGroup", layoutStyles.centeredContent)}>
            <Fab
              variant="extended"
              color="secondary"
              disabled={!physicianRolesState.allRolesValid}
              className={buttonStyles.actionButton}
              onClick={() => addNewPhysicianRole()}
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
          disabled={!physicianRolesState.allRolesValid}
          onClick={saveAllChanges}
        >
          <Save className={buttonStyles.actionButtonIcon} />
          Save
        </Fab>
      </div>
    </div>
  );
}
