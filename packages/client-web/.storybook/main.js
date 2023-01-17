module.exports = {
  core: {
    builder: "@storybook/builder-vite",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  features: {
    // Storybook uses emotion 10, but Chakra uses emotion 11. This causes a
    // conflict and prevents Chakra themes from loading correctly inside
    // sorybook. This is the workaround Storybook is currently providing
    // for that.
    // See https://github.com/storybookjs/storybook/blob/3e5d6601ba3de7e1d6bd64bca97917dc9d40244b/MIGRATION.md#emotion11-quasi-compatibility
    // and https://github.com/chakra-ui/chakra-ui/issues/2527
    emotionAlias: false,
    previewMdx2: true,
  },
};
