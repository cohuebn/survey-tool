import { PhysicianRole } from "../../users/types";

export type PhysicianRolesReducerState = {
  physicianRoles: PhysicianRole[];
  allRolesValid: boolean;
};

export type PhysicianRolesAction =
  | {
      type: "updatePhysicianRole";
      index: number;
      value: PhysicianRole;
    }
  | { type: "deletePhysicianRole"; index: number }
  | { type: "addPhysicianRole"; value: PhysicianRole }
  | { type: "setPhysicianRoles"; value: PhysicianRole[] };
