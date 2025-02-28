import { PhysicianRole } from "../../../users/types";

export type PhysicianRoleSelectionProps = {
  autoFocus?: boolean;
  physicianRoles: PhysicianRole[];
  onChange: (role: PhysicianRole | null) => void;
};
