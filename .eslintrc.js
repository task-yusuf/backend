module.exports = {
  env: {
    node: true,        // Enables Node.js globals like `require`, `module`, `process`
    jest: true         // Enables Jest globals like `jest`, `describe`, `test`, `expect`
  },
  extends: [
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module"
  },
  rules: {
    // Add specific rule customizations here
  }
};
