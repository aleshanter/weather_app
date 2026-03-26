import { useDispatch } from "react-redux";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {Autocomplete, CircularProgress} from "@mui/material";
import { Alert, TextField } from "@mui/material";
import { debounce } from "../../../utils";
import { useLazySearchLocationsQuery, useSearchLocationsQuery, type WeatherApiSearchLocation } from "../../../services/weatherApi";
import { addHistoryItem } from "../../../slices/history";

const SEARCH_DEBOUNCE_MS = 350;
const MIN_SYMBOLS_TO_SEARCH = 2;

export type LocationAutocompleteProps = {
  location: string;
  disabled?: boolean;
  setLocation: (location: string) => void;
};

const getLocationLabel = (o: WeatherApiSearchLocation): string => {
  return [o.name, o.region, o.country].filter(Boolean).join(", ");
}

export function LocationAutocomplete({ disabled, setLocation, location }: LocationAutocompleteProps) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<WeatherApiSearchLocation | null>(null);
  const isSearchReady = debouncedQuery.length >= MIN_SYMBOLS_TO_SEARCH;
  const [lazySearchLocation, {isError: isLazyError}] = useLazySearchLocationsQuery();
  const {
    data: suggestions = [],
    isFetching: suggestionsLoading,
    isError: searchError,
  } = useSearchLocationsQuery(debouncedQuery, {
    skip: disabled || !isSearchReady
  });

  const scheduleDebouncedQuery = useMemo(() => {
    return debounce((q: string) => setDebouncedQuery(q), SEARCH_DEBOUNCE_MS);
}, []);
  


  const applyForecastQuery = (loc: WeatherApiSearchLocation | null) => {
    setSelected(loc);
    setLocation(loc ? `id:${loc.id}` : "");
   
    if (!!loc) {
      dispatch(addHistoryItem({location: getLocationLabel(loc), date: new Date().toISOString()}));
    }
  };

  const onInputChangeHandler = (_: SyntheticEvent, newInputValue: string, reason: string) => {
    if (reason === "reset") {
      // this triggers when the input is changed externally, we need to scip it for this case
      return
    }
    
    setInputValue(newInputValue);
    scheduleDebouncedQuery(newInputValue.trim());

    if (reason === "input" && selected && newInputValue !== getLocationLabel(selected)) {
      applyForecastQuery(null);
    }
    if (reason === "clear") {
      applyForecastQuery(null);
    }
  }

  useEffect(() => {
    if (!location) {
      return
    }

    const fetchLocationLazy = async () => {
      const {data, isError} = await lazySearchLocation(location);
      const locationObject = data?.[0] as WeatherApiSearchLocation;

      if (isError || !locationObject) {
        return
      }
      
      setInputValue(getLocationLabel(locationObject));
      setSelected(locationObject);
      scheduleDebouncedQuery(getLocationLabel(locationObject));
    }

    fetchLocationLazy();
  }, [location])

  const noOptionsText = isSearchReady && !suggestionsLoading ? "No matching places" : `Type at least ${MIN_SYMBOLS_TO_SEARCH} characters`;

  return (
    <>
      <Autocomplete
        sx={{ mb: 2, mt: 4 }}
        disabled={disabled}
        options={suggestions}
        loading={suggestionsLoading}
        filterOptions={(opts) => opts}
        getOptionLabel={(o) => getLocationLabel(o)}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        value={selected}
        onChange={(_, newValue) => {
          applyForecastQuery(newValue);
        }}
        inputValue={inputValue}
        onInputChange={onInputChangeHandler}
        noOptionsText={noOptionsText}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Location"
            placeholder="e.g. London"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {suggestionsLoading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />

      {(searchError || isLazyError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Could not load location suggestions.
        </Alert>
      )}
    </>
  );
}

