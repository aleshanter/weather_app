import { configureStore, Middleware, UnknownAction  } from "@reduxjs/toolkit";
import { weatherApi } from "../services/weatherApi";
import { historySlice } from "./history";

const HISTORY_LOCAL_STORAGE_KEY = 'history';

const historyPersistMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if ((action as UnknownAction).type.startsWith(`${HISTORY_LOCAL_STORAGE_KEY}/`)) {
    const state = store.getState();

    localStorage.setItem(HISTORY_LOCAL_STORAGE_KEY, JSON.stringify(state[HISTORY_LOCAL_STORAGE_KEY]));
  }

  return result;
};

const loadHistoryFromLocalStorage = () => {
  try {
    const history = localStorage.getItem(HISTORY_LOCAL_STORAGE_KEY);
    return history ? {[HISTORY_LOCAL_STORAGE_KEY]: JSON.parse(history)} : undefined;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  preloadedState: loadHistoryFromLocalStorage(),
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
     history: historySlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware, historyPersistMiddleware),
});

