import { Box } from "@mui/material";

type TabPanelProps<TValue> = {
  id: string;
  children?: React.ReactNode;
  tabValue: TValue;
  selectedValue: TValue;
};

export function TabPanel<TValue>(props: TabPanelProps<TValue>) {
  const { children, selectedValue, tabValue, id, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={selectedValue !== tabValue}
      id={id}
      aria-labelledby={id}
      {...other}
    >
      {selectedValue === tabValue && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
