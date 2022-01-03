module.exports = {
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/preset-create-react-app",
  ],
  core: {
    builder: "webpack5",
  },
  features: {
    // Storybook uses emotion 10, but Chakra uses emotion 11. This causes a
    // conflict and prevents Chakra themes from loading correctly inside
    // sorybook. This is the workaround Storybook is currently providing
    // for that.
    // See https://github.com/storybookjs/storybook/blob/3e5d6601ba3de7e1d6bd64bca97917dc9d40244b/MIGRATION.md#emotion11-quasi-compatibility
    // and https://github.com/chakra-ui/chakra-ui/issues/2527
    emotionAlias: false,
  },
  refs: {
    "@chakra-ui/react": { disable: true },
  },
  staticDirs: ["../public"],
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  webpackFinal: async (config) => {
    // Webpack5 has removed support for node builtins, so we need to explicitly
    // add support for them here. These will surface with an error message like:
    // "<package> tried to access <builtin>. While this module is usually interpreted as a Node builtin, your resolver is running inside a non-Node resolution context where such builtins are ignored."

    config.plugins.forEach((plugin) => {
      // ProvidePlugin sets "process" to resolve to "process/browser.js", but
      // this is not working because we're using Yarn PnP -- we need to use
      // `require.resolve` to get the correct location.
      if (plugin.constructor.name === "ProvidePlugin") {
        plugin.definitions.process = require.resolve("process/browser.js");
      }
    });

    config.resolve.fallback.assert = require.resolve("assert/");

    return config;
  },
};
