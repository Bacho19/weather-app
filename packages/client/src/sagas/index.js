import { all } from "redux-saga/effects";
import { weatherSaga } from "./weather";

function* rootSaga() {
  yield all([weatherSaga()]);
}

export default rootSaga;
