/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".svg"],
      },
    },
  },
  rules: {
    quotes: ["warn", "double", { avoidEscape: true }],
    "comma-dangle": ["warn", "only-multiline"],
    semi: ["warn", "always"],
    "no-empty-function": "off",
    "no-unused-private-class-members": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: false,
        fixStyle: "separate-type-imports",
      },
    ],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: {
          memberTypes: [
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            "public-static-method",
            "protected-static-method",
            "private-static-method",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "public-abstract-field",
            "protected-abstract-field",
            "public-constructor",
            "protected-constructor",
            "private-constructor",
            "public-instance-method",
            "protected-instance-method",
            "private-instance-method",
            "public-abstract-method",
            "protected-abstract-method",
          ],
          order: "as-written",
        },
      },
    ],
    "@typescript-eslint/no-empty-function": ["error", { allow: ["private-constructors"] }],
    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/order": ["warn", { groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"] }],
  },
};
