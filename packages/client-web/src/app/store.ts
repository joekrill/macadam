import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { errorReduxEnhancer } from "../features/errors/middleware";
import { identityApi } from "../features/identity/identityApi";
import { identitySlice } from "../features/identity/identitySlice";

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
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
export type AppThunkAction<
  ReturnType = void,
  ExtraArgument = unknown
> = ThunkAction<ReturnType, RootState, ExtraArgument, Action<string>>;

declare module "react-redux" {
  export interface DefaultRootState extends RootState {}
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
