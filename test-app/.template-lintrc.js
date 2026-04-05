'use strict';

module.exports = {
  plugins: ['ember-template-lint-plugin-prettier'],
  extends: ['recommended', 'ember-template-lint-plugin-prettier:recommended'],
  rules: {
    // there isn't any value in adding labels in our tests
    'require-input-label': 'off',
  },
};
