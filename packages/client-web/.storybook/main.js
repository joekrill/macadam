module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  // stories: ["../src/app/App.stories.mdx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/preset-create-react-app",
  ],
  refs: {
    "@chakra-ui/react": { disable: true },
  },

  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,

          // HACK: Styles do not get applied in storybook correctly without
          // these aliases. More info here: https://github.com/chakra-ui/chakra-ui/issues/2527
          // "@emotion/core": require.resolve("@emotion/react"),
          // "emotion-theming": require.resolve("@emotion/react"),
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
        },
      },
    };
  },
};
