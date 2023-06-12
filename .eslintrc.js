module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'mocha': true
  },
  extends: ["eslint:recommended", "prettier"],
  'overrides': [
  ],

  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  ignorePatterns: [".eslintrc.js"],

  rules: {
    "interface-name-prefix": "off",
    "explicit-function-return-type": "off",
    "explicit-module-boundary-types": "off",
    "no-explicit-any": "off",
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
