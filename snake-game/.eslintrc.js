module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "plugin:import/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["warn", "double", { avoidEscape: true }],
    "comma-dangle": ["warn", "only-multiline"],
    semi: ["warn", "always"],
    "no-empty-function": "off",
    "no-unused-private-class-members": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/order": ["error", { groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"] }],
    "@typescript-eslint/no-empty-function": ["error", { allow: ["private-constructors"] }],
  },
};
