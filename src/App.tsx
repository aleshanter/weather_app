import { useState } from "react";
import { Alert, Container, Typography, Paper } from "@mui/material";
import { CityForecast } from "./features/CityForecast";
import { LocationAutocomplete } from "./features/CityForecast/LocationAutocomplete";
import { useGetForecastByCityQuery } from "./services/weatherApi";
import { SearchHistory } from "./features/SearchHistory";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const hasApiKey = !!apiKey && apiKey.trim().length > 0;

//FYI: not optimal way to place logic here - App must be clear of business logic and current
//content should be in a separate component (like it's own page)
function App() {
  const [location, setLocation] = useState("");
  const { data, isLoading, isFetching, isError } = useGetForecastByCityQuery(
    location,
    { skip: !hasApiKey || !location }
  );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 2 }}> 
        <Typography variant="h4" component="h1" gutterBottom>
          Weather forecast for today
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Start typing a place name — suggestions come from WeatherAPI.com
        </Typography>

        {!hasApiKey && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Add <code>VITE_WEATHER_API_KEY</code> to a <code>.env</code> file (see{" "}
            <code>.env.example</code>) and restart the dev server.
          </Alert>
        )}

        <LocationAutocomplete
          disabled={!hasApiKey}
          location={location}
          setLocation={setLocation}
        />

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
          Could not load forecast.
          </Alert>
        )}

        {isLoading && location && (
          <Typography>Loading…</Typography>
        )}

        {data && <CityForecast data={data} isFetching={isFetching}/>}
       </Paper>

      {/* TODO: Move this state to Redux, this is not the best idea because of props drilling. */}
      <SearchHistory setLocation={setLocation}/>
    </Container>
  );
}

export default App;
