module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "../../.eslintrc.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
  ],
  ignorePatterns: ["src/features/i18n/messages/**", "*.svg", "*.mdx"],
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "allow-with-description",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      rules: {
        "no-fallthrough": "off",
      },
    },
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off",
      },
    },
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off",
      },
    },
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off",
      },
    },
  ],
};
