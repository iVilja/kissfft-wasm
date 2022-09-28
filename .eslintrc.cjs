/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "prefer-rest-params": 0,
  },
  parserOptions: {
    sourceType: "module",
  },
  ignorePatterns: ["/deps"],
}
