import Constants from "expo-constants";
import {
  appApi,
  authSlice,
  identityApi,
  setApiHost,
} from "@macadam/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
// import { monitoringReduxEnhancer } from "../features/monitoring/monitoringReduxEnhancer";

setApiHost(Constants.expoConfig?.extra?.apiHost);

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
  },
  combineReducers({
    [appApi.reducerPath]: appApi.reducer,
    [authSlice.name]: authSlice.reducer,
    [identityApi.reducerPath]: identityApi.reducer,
  })
);

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: persistedReducer,
  // enhancers: [monitoringReduxEnhancer],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(appApi.middleware, identityApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void, ExtraArgument = unknown> = ThunkAction<
  ReturnType,
  RootState,
  ExtraArgument,
  Action<string>
>;

declare module "react-redux" {
  export interface DefaultRootState extends RootState {}
}
