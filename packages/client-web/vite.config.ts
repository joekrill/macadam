/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { checker } from "vite-plugin-checker";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr"; // allows you to import svgs as react components

export default defineConfig(({ mode }) => {
  // expose .env as process.env instead of import.meta.env
  // Reference: https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const env = loadEnv(mode, process.cwd(), "");
  env.NODE_ENV = mode;

  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
  };

  return {
    build: {
      outDir: "build",
    },
    plugins: [
      react(),
      svgr(),
      htmlPlugin(loadEnv(mode, ".")),
      checker({
        typescript: true,
      }),
      // eslint is currently causing this error when running tests:
      // "DeprecationWarning: The 'typeParameters' property is deprecated on TSTypeReference nodes. Use 'typeArguments' instead. See https://typescript-eslint.io/linting/troubleshooting#the-key-property-is-deprecated-on-type-nodes-use-key-instead-warnings."
      mode !== "test" &&
        eslint({
          // Fix for storybook issue: https://github.com/gxmari007/vite-plugin-eslint/pull/52
          // @ts-ignore: This is typed incorrectly - Regexes are ok here
          exclude: [/virtual:/, /node_modules/],
        }),
    ],
    define: envWithProcessPrefix,
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        reporter: ["text", "html"],
        exclude: ["node_modules/", "src/setupTests.ts"],
      },
    },
  };
});

/**
 * Replace env variables in index.html
 * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
 * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
 */
function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre" as const,
      transform: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  };
}
