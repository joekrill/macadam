import { getBestMatchLocale } from "./getBestMatchLocale";

export const getDevicePreferredLocale = () => {
  const preferred = navigator.languages
    ? [...navigator.languages]
    : [navigator.language];
  return getBestMatchLocale(preferred);
};
