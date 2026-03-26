import { SyntheticEvent, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Button, IconButton, CircularProgress, Box, SnackbarProps } from "@mui/material";
import { Toast as ToastInterface } from "..";

interface HistorySnackBarProps {
    toast: ToastInterface;
    index: number;
    onRemoveToast: (event: SyntheticEvent, reason?: string) => void;
    onUndoRemove: () => void
}

const REMOVE_DELAY = 6000;
const TICK_INTERVAL = 300;

export const HistorySnackBar = ({toast, index, onRemoveToast, onUndoRemove}: HistorySnackBarProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let tick = 0;
        const totalTicks = REMOVE_DELAY / TICK_INTERVAL;

        const interval = setInterval(() => {
            tick++;
            const nextProgress = Math.min((100 * tick) / totalTicks, 100);
            setProgress(nextProgress);

            if (tick >= totalTicks) {
                clearInterval(interval);
            }
        }, TICK_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, []);

  return (
    <Snackbar
      key={toast.id}
      open={true}
      onClose={onRemoveToast as SnackbarProps['onClose']}
      autoHideDuration={REMOVE_DELAY}
      message={toast.message}
      sx={{ mb: 8 * index }}
      action={
        <>
          <Button onClick={onUndoRemove}>UNDO</Button>
          <IconButton
            sx={{ p: 0.5 }}
            onClick={onRemoveToast}
          >
            <Box sx={{ position: 'relative' }}>
              <CloseIcon color="warning" />
              <CircularProgress
                variant="determinate"
                color="warning"
                value={progress}
                size={30}
                sx={{
                  position: 'absolute',
                  top: -3,
                  left: -3,
                }}
              />
            </Box>
          </IconButton>
        </>
      }
    />
  )
}