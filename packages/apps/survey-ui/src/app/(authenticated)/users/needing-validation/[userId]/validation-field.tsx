import { Typography } from "@mui/material";

import styles from "./styles.module.css";

type TFieldValue = string | number | Date;

type Props = {
  label: string;
  value: TFieldValue | undefined;
};

export default function ValidationField({ label, value }: Props) {
  return (
    <div className={styles.validationField}>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body2" component="div">
        {value?.toString()}
      </Typography>
    </div>
  );
}
