import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginSvelte from "eslint-plugin-svelte";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...eslintPluginSvelte.configs["flat/recommended"],
  {
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "windows"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    ignores: [
      "node_modules/",
      "dist/",
      "eslint.config.js",
      ".env",
      "src/main.js",
      "vite.config.js",
      "svelte.config.js",
    ],
  },
];
