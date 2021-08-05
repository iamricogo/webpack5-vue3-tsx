module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-rational-order'],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
    'stylelint-config-rational-order/plugin',
    'stylelint-prettier'
  ],
  rules: {
    'at-rule-no-unknown': null,
    'no-invalid-position-at-import-rule': null,
    'font-family-no-missing-generic-family-keyword': null,
    'scss/at-rule-no-unknown': true
  }
}
