import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authSlice } from "../features/auth/authSlice";
import { selfServiceApi } from "../services/selfService";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [selfServiceApi.reducerPath]: selfServiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(selfServiceApi.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunkAction<ReturnType = void, ExtraArgument = unknown> =
  ThunkAction<ReturnType, RootState, ExtraArgument, Action<string>>;

declare module "react-redux" {
  export interface DefaultRootState extends RootState {}
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
