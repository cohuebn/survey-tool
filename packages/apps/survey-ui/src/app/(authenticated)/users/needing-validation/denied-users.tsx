import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { UserWithValidationData } from "../../../users/types";

type DeniedUsersProps = {
  deniedUsers: UserWithValidationData[];
};

export function DeniedUsers({ deniedUsers }: DeniedUsersProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="New users needing validation">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Hospital</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Denied time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deniedUsers.map((user) => (
            <TableRow
              key={user.userId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link href={`/users/needing-validation/${user.userId}`}>
                  {user.userValidation.emailAddress}
                </Link>
              </TableCell>
              <TableCell>{user.hospitals?.name}</TableCell>
              <TableCell>{`${user.hospitals?.city}, ${user.hospitals?.state}`}</TableCell>
              <TableCell>{`${user.userValidation.deniedTimestamp}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
