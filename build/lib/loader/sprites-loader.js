const loaderUtils = require('loader-utils')
const path = require('path')
const utils = require('./utils')
module.exports = async function (content) {
  options = Object.assign(
    loaderUtils.getOptions(this) || {},
    {
      name: 'assets/[name].[contenthash].[ext]'
    },
    loaderUtils.getOptions(this) || {}
  )

  const reg = /(\w|-|~|@|\/)+\.(png|jpg)/g

  return utils.emitFile(
    this,
    await utils.replaceAsync(content, reg, async (match) => {
      const request = loaderUtils.urlToRequest(match)

      const realPath = await utils.reslove(this, request)

      if (realPath) {
        const ext = path.extname(match)
        const name = path.basename(match, ext)
        return utils.getAssetsPath(
          utils.emitFile(this, await utils.readFile(realPath), {
            name: options.name.replace('[name]', name).replace('.[ext]', ext),
            publicPath: '../'
          })
        )
      }
      return match
    })
  )
}
