import "dotenv/config";

declare namespace NodeJS {
  interface ProcessEnv {
    API_HOST: string | undefined;
  }
}

const config = {
  expo: {
    name: "client-mobile",
    slug: "client-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiHost: process.env.API_HOST,
    },
  },
};

export default config;
