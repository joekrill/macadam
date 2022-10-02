import Plausible, { EventOptions, PlausibleOptions } from "plausible-tracker";

let plausible: ReturnType<typeof Plausible> | undefined;

if (process.env.REACT_APP_PLAUSIBLE_HOST) {
  plausible = Plausible({
    // domain: REACT_APP_DOMAIN,
    trackLocalhost: process.env.NODE_ENV === "development",
    apiHost: process.env.REACT_APP_PLAUSIBLE_HOST,
  });

  plausible.enableAutoPageviews();
  plausible.enableAutoOutboundTracking();
}

export const trackEvent = (
  eventName: string,
  options?: EventOptions,
  eventData?: PlausibleOptions
) => {
  if (plausible) {
    plausible.trackEvent(eventName, options, eventData);
  }
};

export const trackPageview = (
  eventData?: PlausibleOptions,
  options?: EventOptions
) => {
  if (plausible) {
    plausible.trackPageview(eventData, options);
  }
};
