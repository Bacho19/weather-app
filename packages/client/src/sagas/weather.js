import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchWeather,
  fetchWeatherAccess,
  fetchWeatherError,
  changeCoordinates,
} from "../store/weather/reducer";
import { baseUrl } from "../api";

function* fetchWetherHandler({ payload: { lat, lon } }) {
  try {
    const response = yield axios.get(
      `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_ID}`
    );
    yield put(fetchWeatherAccess(response.data));
  } catch (error) {
    yield put(fetchWeatherError(error.message));
  }
}

// watcher
export function* weatherSaga() {
  yield takeEvery(fetchWeather.type, fetchWetherHandler);
  yield takeEvery(changeCoordinates.type, fetchWetherHandler);
}
