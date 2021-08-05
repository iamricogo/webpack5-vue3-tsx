module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order'
    // 'stylelint-config-prettier'
  ],
  plugins: ['stylelint-scss', 'stylelint-order'], // stylelint-order是CSS属性排序插件
  rules: {
    'at-rule-no-unknown': null,
    'no-invalid-position-at-import-rule': null,
    'font-family-no-missing-generic-family-keyword': null,
    'scss/at-rule-no-unknown': true
  }
}
