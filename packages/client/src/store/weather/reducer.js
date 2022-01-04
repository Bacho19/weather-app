import { createSlice } from "@reduxjs/toolkit";
import { fetchWeatherData } from "../weather/action";

const initialState = {
  loading: false,
  weather: {},
  coordinates: { lat: 41.6941, lon: 44.8337 },
  error: "",
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  extraReducers: {
    [fetchWeatherData.pending.type]: (state) => {
      state.loading = true;
    },
    [fetchWeatherData.fulfilled.type]: (state, { payload }) => {
      state.weather = payload;
      state.loading = false;
    },
    [fetchWeatherData.rejected.type]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
  reducers: {
    fetchWeather(state) {
      state.loading = true;
    },
    fetchWeatherAccess(state, action) {
      state.loading = false;
      state.weather = action.payload;
    },
    fetchWeatherError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    changeCoordinates(state, action) {
      state.loading = true;
      state.coordinates = action.payload;
    },
  },
});

export const {
  fetchWeather,
  fetchWeatherAccess,
  fetchWeatherError,
  changeCoordinates,
} = weatherSlice.actions;
export default weatherSlice.reducer;
