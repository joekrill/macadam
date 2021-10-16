import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { identityApi } from "../features/auth/identityApi";
import { identitySlice } from "../features/auth/identitySlice";
import { errorReduxEnhancer } from "../features/errors/middleware";
import { i18nSlice } from "../features/i18n/i18nSlice";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    [i18nSlice.name]: i18nSlice.reducer,
    [identitySlice.name]: identitySlice.reducer,
    [identityApi.reducerPath]: identityApi.reducer,
  },
  enhancers: [errorReduxEnhancer],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(identityApi.middleware),
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
