// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [ 
    "@rushstack/eslint-config/profile/node",
    "@rushstack/eslint-config/mixins/react",
  ],  // <---- put your profile string here
  parserOptions: { tsconfigRootDir: __dirname },
  settings: {
    react: {
      "version": "18.3.1" // <----
    }
  }
};