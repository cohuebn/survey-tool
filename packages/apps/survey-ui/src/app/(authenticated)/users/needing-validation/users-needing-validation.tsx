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

type UsersNeedingValidationProps = {
  unvalidatedUsers: UserWithValidationData[];
};

export function UsersNeedingValidation({
  unvalidatedUsers,
}: UsersNeedingValidationProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="New users needing validation">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Hospital</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Employment Type</TableCell>
            <TableCell align="right">NPI Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unvalidatedUsers.map((user) => (
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
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.employmentType}</TableCell>
              <TableCell align="right">
                {user.userValidation.npiNumber}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
