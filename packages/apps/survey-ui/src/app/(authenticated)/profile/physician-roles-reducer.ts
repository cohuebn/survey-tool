import { isNotNullOrUndefined } from "@survey-tool/core";

import { PhysicianRole } from "../../users/types";

import { PhysicianRolesAction, PhysicianRolesReducerState } from "./types";

function isPhysicianRoleValid(role: PhysicianRole): boolean {
  return (
    isNotNullOrUndefined(role.userId) &&
    isNotNullOrUndefined(role.hospital) &&
    isNotNullOrUndefined(role.department) &&
    isNotNullOrUndefined(role.employmentType)
  );
}

function arePhysicianRolesValid(roles: PhysicianRole[]): boolean {
  return roles.every(isPhysicianRoleValid);
}

function getValidatedState(roles: PhysicianRole[]): PhysicianRolesReducerState {
  return {
    physicianRoles: roles,
    allRolesValid: arePhysicianRolesValid(roles),
  };
}

function addRole(
  state: PhysicianRolesReducerState,
  role: PhysicianRole,
): PhysicianRolesReducerState {
  const updatedRoles = [...state.physicianRoles, role];
  return getValidatedState(updatedRoles);
}

function deleteRole(
  state: PhysicianRolesReducerState,
  roleIndex: number,
): PhysicianRolesReducerState {
  const updatedRoles = state.physicianRoles.filter(
    (_, index) => index !== roleIndex,
  );
  return getValidatedState(updatedRoles);
}

function updateRole(
  state: PhysicianRolesReducerState,
  roleIndex: number,
  updatedRole: PhysicianRole,
): PhysicianRolesReducerState {
  const updatedRoles = state.physicianRoles.map((role, index) =>
    index === roleIndex ? updatedRole : role,
  );
  return getValidatedState(updatedRoles);
}

export function physicianRolesReducer(
  state: PhysicianRolesReducerState,
  action: PhysicianRolesAction,
) {
  switch (action.type) {
    case "addPhysicianRole":
      return addRole(state, action.value);
    case "deletePhysicianRole":
      return deleteRole(state, action.index);
    case "updatePhysicianRole":
      return updateRole(state, action.index, action.value);
    case "setPhysicianRoles":
      return getValidatedState(action.value);
    default:
      return state;
  }
}
