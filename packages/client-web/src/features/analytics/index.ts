import Plausible, { EventOptions, PlausibleOptions } from "plausible-tracker";

let plausible: ReturnType<typeof Plausible> | undefined;

if (process.env.VITE_PLAUSIBLE_HOST) {
  plausible = Plausible({
    // domain: VITE_DOMAIN,
    trackLocalhost: process.env.NODE_ENV === "development",
    apiHost: process.env.VITE_PLAUSIBLE_HOST,
  });

  plausible.enableAutoPageviews();
  plausible.enableAutoOutboundTracking();
}

export const trackEvent = (
  eventName: string,
  options?: EventOptions,
  eventData?: PlausibleOptions,
) => {
  if (plausible) {
    plausible.trackEvent(eventName, options, eventData);
  }
};

export const trackPageview = (
  eventData?: PlausibleOptions,
  options?: EventOptions,
) => {
  if (plausible) {
    plausible.trackPageview(eventData, options);
  }
};
