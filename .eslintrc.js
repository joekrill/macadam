module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:import/recommended"],
  settings: {
    "import/resolver": {
      typescript: true,
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
      },
      extends: [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
        // Make sure it's always the last config, so it gets the chance to override other configs.
        "eslint-config-prettier",
      ],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "none",
            ignoreRestSiblings: true,
          },
        ],
      },
    },
    {
      // For spec/test files we can be much more lenient because most warnings
      // are caused by mocks
      files: ["**/*.test.[tj]s?(x)", "**/*.spec.[tj]s?(x)"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-function": "off",
      },
    },
  ],
};
