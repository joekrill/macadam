/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_VERSION: string;
    REACT_APP_NAME: string;
    REACT_APP_DISPLAY_NAME: string;
    REACT_APP_SHORT_NAME: string;
    REACT_APP_DESCRIPTION: string;
    REACT_APP_THEME_COLOR: string;
    REACT_APP_EMAIL_SUPPORT?: string;
    REACT_APP_EMAIL_CONTACT?: string;
    REACT_APP_URL_LINKEDIN?: string;
    REACT_APP_URL_GITHUB?: string;
    REACT_APP_URL_TWITTER?: string;
    REACT_APP_URL_INSTAGRAM?: string;
    REACT_APP_PLAUSIBLE_HOST?: string;
    REACT_APP_SENTRY_DSN?: string;
    REACT_APP_SENTRY_TUNNEL?: string;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
