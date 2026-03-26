import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { omit } from "../utils";

export interface HistoryItem {
    location: string
    date: string;
}

interface HistoryState {
  [key: string]: string[];
}


export const historySlice = createSlice({
  name: "history",
  initialState: {} as HistoryState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      const {location, date} = action.payload;
      const currentSearchesForSity = state[location] || [];

      return {...state, [location]: [...currentSearchesForSity, date]};
    },
    removeHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      const {location, date} = action.payload; 
      const currentSearchesForSity = state[location] || [];
      const nextLocationSearches = currentSearchesForSity.filter(searchDate => searchDate !== date);


      return !!nextLocationSearches.length 
      ? {...state, [location]: nextLocationSearches} 
      : omit(state, [location]);
    }
  }
});

export const { addHistoryItem, removeHistoryItem } = historySlice.actions;
export const getSearchHistory = (state: { history: HistoryState }): HistoryState => state.history;
