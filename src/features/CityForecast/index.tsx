import { type ReactNode } from "react";
import { Box, Paper, Stack, Typography, Backdrop, CircularProgress } from "@mui/material";
import { WindDirectionIcon } from "./WindDirectionIcon";
import type { WeatherApiForecastResponse } from "../../services/weatherApi";

export type CityForecastProps = {
  data: WeatherApiForecastResponse;
  isFetching: boolean
};

export function CityForecast({ data, isFetching }: CityForecastProps) {
  const {name, region, country} = data.location;
  const {temp_c, condition, wind_kph, wind_degree, wind_dir} = data.current;
  const today = data.forecast.forecastday[0]?.day;
  if (!today) return 'No forecast data available for this location today';


  return (
    <Paper sx={{mt: 2, p: 2, position: 'relative' }}>
      <Backdrop
          open={isFetching}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
              }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h5" color="text.secondary" gutterBottom>
        {name}
        {region ? `, ${region}` : ""}, {country}
      </Typography>
      <Stack spacing={1.25} component="dl" sx={{ m: 0 }}>
        <DetailRow label="Current temperature" value={`${temp_c} °C`} />
        <DetailRow label="Weather description" value={condition.text} />
        <DetailRow
          label="Minimum and maximum temperatures (today)"
          value={`${today.mintemp_c} °C low · ${today.maxtemp_c} °C high`}
        />
        <DetailRow
          label="Wind speed"
          value={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <WindDirectionIcon
                windDegree={wind_degree}
                windDir={wind_dir}
              />
              <span>{wind_kph} km/h</span>
              <Typography component="span" variant="body2" color="text.secondary">
                ({wind_dir})
              </Typography>
            </Box>
          }
        />
      </Stack>
    </Paper>
  );
}

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <Box component="div">
      <Typography component="dt" variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography component="dd" variant="body1" sx={{ m: 0 }}>
        {value}
      </Typography>
    </Box>
  );
}
