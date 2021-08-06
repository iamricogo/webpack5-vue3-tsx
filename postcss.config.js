// CSS后处理
const postcssPresetEnv = require('postcss-preset-env')
module.exports = {
  plugins: [postcssPresetEnv({ stage: 0 })]
}
