/**
 * @type {import('stylelint').Config}
 */
const styleConfiguration = {
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
  plugins: ["stylelint-prettier"],
  rules: {
    "prettier/prettier": true,
    "function-name-case": null,
    "selector-pseudo-class-no-unknown": null,
  },
  ignoreFiles: ["**/*.(t|j)sx"],
};

export default styleConfiguration;
