module.exports = {
  extends: 'stylelint-config-standard',
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'declaration-block-no-duplicate-properties': true,
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
    'selector-id-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
  },
};
