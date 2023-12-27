import {
  appApi,
  identityApi,
  identitySlice,
  invalidateIdentity,
  invalidateSession,
} from "@macadam/api-client";
import {
  Action,
  ThunkAction,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { i18nSlice } from "../features/i18n/i18nSlice";
import { monitoringReduxEnhancer } from "../features/monitoring/monitoringReduxEnhancer";

// The identityChannel is used to broadcast identity/session changes across
// browser tabs/windows, and when we recieve the event we refresh them.
// So if someone, for example, clicks a "verify" link that opens in new window,
// any existing window open will know to refresh the identity if the verification
// succeeded (or logout, etc...)
const identityChannel = new BroadcastChannel("identity");
identityChannel.addEventListener("message", (ev) => {
  if (ev.data === "refresh") {
    store.dispatch(invalidateIdentity());
    store.dispatch(invalidateSession());
  }
});

const identityListener = createListenerMiddleware();
identityListener.startListening({
  matcher: isAnyOf(
    identityApi.endpoints.submitVerificationFlow.matchFulfilled,
    identityApi.endpoints.submitLoginFlow.matchFulfilled,
    identityApi.endpoints.submitRegistrationFlow.matchFulfilled,
    identityApi.endpoints.submitSettingsFlow.matchFulfilled,
    identityApi.endpoints.logout.matchFulfilled,
  ),
  effect: async () => identityChannel.postMessage("refresh"),
});

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    [i18nSlice.name]: i18nSlice.reducer,
    [identityApi.reducerPath]: identityApi.reducer,
    [identitySlice.name]: identitySlice.reducer,
  },
  enhancers: [monitoringReduxEnhancer],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      appApi.middleware,
      identityApi.middleware,
      identityListener.middleware,
    ),
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
