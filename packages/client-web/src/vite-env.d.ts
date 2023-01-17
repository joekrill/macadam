/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_VERSION: string;
    VITE_NAME: string;
    VITE_DISPLAY_NAME: string;
    VITE_SHORT_NAME: string;
    VITE_DESCRIPTION: string;
    VITE_THEME_COLOR: string;
    VITE_EMAIL_SUPPORT?: string;
    VITE_EMAIL_CONTACT?: string;
    VITE_URL_LINKEDIN?: string;
    VITE_URL_GITHUB?: string;
    VITE_URL_TWITTER?: string;
    VITE_URL_INSTAGRAM?: string;
    VITE_PLAUSIBLE_HOST?: string;
    VITE_SENTRY_DSN?: string;
    VITE_SENTRY_TUNNEL?: string;
  }
}
