import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import reduxSaga from "redux-saga";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import weatherReducer from "./weather/reducer";
import authReducer from "./auth/reducer";
import themeReducer from "./theme/reducer";
import rootSaga from "../sagas";

const rootReducer = combineReducers({
  weather: weatherReducer,
  auth: authReducer,
  theme: themeReducer,
});

const sagaMiddleware = reduxSaga();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  sagaMiddleware,
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
