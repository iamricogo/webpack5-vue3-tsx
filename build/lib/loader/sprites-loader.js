const loaderUtils = require('loader-utils')
const path = require('path')
const utils = require('./utils')
module.exports = async function (content, options = {}) {
  options = Object.assign(
    {
      name: 'assets/[name].[contenthash].[ext]'
    },
    loaderUtils.getOptions(this) || {},
    options
  )

  const reg = /(\w|-|~|@|\/)+\.(png|jpg)/g
  const contentEmitDir = path.dirname(utils.getEmitName(this, content, options))
  const newContent = await utils.replaceAsync(content, reg, async (match) => {
    const request = loaderUtils.urlToRequest(match)
    const realPath = await utils.resolve(this, request)
    if (realPath) {
      this.addDependency(realPath)
      const ext = path.extname(match)
      const name = path.basename(match, ext)
      const imgContent = await utils.readFile(realPath)
      const args = [
        this,
        imgContent,
        {
          name:
            options.name.replace(/\.\[(\w|-)+\]/g, '') +
            `.${name}.[contenthash]${ext}`
        }
      ]

      utils.fileLoader(...args)
      const imgEmitName = utils.getEmitName(...args)
      return path.posix.relative(contentEmitDir, imgEmitName)
    }
    return match
  })

  return utils.fileLoader(this, newContent, options)
}
