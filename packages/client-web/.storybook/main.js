import { dirname, join } from "path";

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
