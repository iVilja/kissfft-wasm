/* eslint-env node */
module.exports = {
  root: true,
  env: {
    // "browser": true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prefer-rest-params": 0
  }
}
