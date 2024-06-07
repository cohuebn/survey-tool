"use client";

import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import Link from "next/link";

import { useUnvalidatedUsers } from "../../../users/use-unvalidated-users";

export default function Page() {
  const { unvalidatedUsers, unvalidatedUsersLoaded } = useUnvalidatedUsers();

  if (!unvalidatedUsersLoaded) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Users requiring validation</Typography>

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
    </div>
  );
}
