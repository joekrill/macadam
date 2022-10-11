import { appApi, authSlice, identityApi } from "@macadam/api-client";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { i18nSlice } from "../features/i18n/i18nSlice";
import { monitoringReducEnhancer } from "../features/monitoring/monitoringReducEnhancer";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    [i18nSlice.name]: i18nSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [identityApi.reducerPath]: identityApi.reducer,
  },
  enhancers: [monitoringReducEnhancer],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware, identityApi.middleware),
});

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
