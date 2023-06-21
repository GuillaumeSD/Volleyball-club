module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "require-jsdoc": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "import/no-unresolved": 0,
  },
};
