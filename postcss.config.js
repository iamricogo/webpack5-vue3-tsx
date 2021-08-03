// CSS后处理
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nesting') /** https://github.com/csstools/postcss-nesting */
  ]
}
