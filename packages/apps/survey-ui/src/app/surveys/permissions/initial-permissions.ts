import { v4 as uuidV4 } from "uuid";

import { EditablePermissions } from "../types";

export function getInitialPermissions(): EditablePermissions {
  return {
    id: uuidV4(),
    isPublic: true,
    restrictByLocation: false,
    restrictByDepartment: false,
  };
}
