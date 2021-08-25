module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended'
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
    'stylelint-config-rational-order/plugin'
  ],
  rules: {
    'at-rule-no-unknown': null,
    'selector-pseudo-class-no-unknown': null,
    'no-invalid-position-at-import-rule': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'scss/at-rule-no-unknown': true
  }
}
