import { Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

type WindDirectionIconProps = {
  /** Degrees clockwise from north (direction wind blows from). */
  windDegree: number;
  /** Compass label for tooltip / a11y, e.g. `NNW`. */
  windDir: string;
  size?: number;
};


export function WindDirectionIcon({ windDegree, windDir, size = 22 }: WindDirectionIconProps) {
  return (
    <Box
      component="span"
      aria-hidden
      title={`Wind from ${windDir} (${windDegree}°)`}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color: "text.secondary",
        transform: `rotate(${windDegree}deg)`,
        transformOrigin: "center",
        flexShrink: 0
      }}
    >
      <ArrowUpwardIcon sx={{ fontSize: size }} />
    </Box>
  );
}
