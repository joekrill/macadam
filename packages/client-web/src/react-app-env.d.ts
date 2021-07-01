/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_VERSION: string;
    REACT_APP_NAME: string;
    REACT_APP_DISPLAY_NAME: string;
    REACT_APP_PLAUSIBLE_HOST?: string;
    // REACT_APP_DOMAIN: string;
  }
}
