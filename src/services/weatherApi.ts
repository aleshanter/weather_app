import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface WeatherApiForecastResponse {
  location: {
    name: string;
    region?: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: { text: string };
    wind_kph: number;
    /** Direction wind blows *from*, degrees clockwise from north. */
    wind_degree: number;
    /** 16-point compass, e.g. WSW. */
    wind_dir: string;
  };
  forecast: {
    forecastday: Array<{
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: { text: string };
      };
    }>;
  };
}


export interface WeatherApiSearchLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url?: string;
}

const key = encodeURIComponent(import.meta.env.VITE_WEATHER_API_KEY ?? "");

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.weatherapi.com/v1/"
  }),
  endpoints: (builder) => ({
    getForecastByCity: builder.query<WeatherApiForecastResponse, string>({
      query: (city) =>
        `forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=1`
    }),
    searchLocations: builder.query<WeatherApiSearchLocation[], string>({
      query: (q) => `search.json?key=${key}&q=${encodeURIComponent(q)}`,
      transformResponse(response: unknown) {
        return Array.isArray(response) ? (response as WeatherApiSearchLocation[]) : [];
      }
    }),
  })
});

export const { useGetForecastByCityQuery, useSearchLocationsQuery, useLazySearchLocationsQuery } = weatherApi;
