import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";

import { deleteSurvey } from "../../surveys";
import { useSupabaseDb } from "../../supabase/use-supabase-db";
import { parseError } from "../../errors/parse-error";

type DeleteSurveyDialogProps = {
  surveyId: string;
  title: string;
  open: boolean;
  onClose: (deleted: boolean) => void;
};

export function DeleteSurveyDialog({
  surveyId,
  title,
  open,
  onClose,
}: DeleteSurveyDialogProps) {
  const dbClient = useSupabaseDb();
  const onDelete = async () => {
    if (!dbClient.clientLoaded) {
      throw new Error(
        "DB client not loaded; can't delete survey. Please retry; if the problem persists, contact support.",
      );
    }
    try {
      await deleteSurvey(dbClient.client, surveyId);
      toast(`Survey ${title} deleted`, { type: "success" });
    } catch (error: unknown) {
      const parsedError = await parseError(error);
      toast(`Failed to delete survey: ${parsedError}`, {
        type: "error",
      });
    }
    onClose(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Survey</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`You are about to delete the survey named "${title}". This action cannot be undone. Are you sure you want to proceed?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="outlined" onClick={() => onClose(false)} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
