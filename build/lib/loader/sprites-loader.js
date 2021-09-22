const loaderUtils = require('loader-utils')
const path = require('path')
const utils = require('./utils')
module.exports = async function (content, options = {}) {
  const defaultHash = `[md4:contenthash:hex:20]`
  options = Object.assign(
    {
      //默认同步webpack5 hash算法默认规则
      name: `assets/[name].${defaultHash}.[ext]`
    },
    loaderUtils.getOptions(this) || {},
    options
  )

  const imgReg = /(\w|-|~|@|\/)+\.(png|jpe?g)/g
  const hashReg =
    /\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi

  const contentEmitDir = path.dirname(utils.getEmitName(this, content, options))

  const newContent = await utils.replaceAsync(
    content,
    imgReg,
    async (match) => {
      const request = loaderUtils.urlToRequest(match)
      const realPath = await utils.resolve(this, request)
      if (realPath) {
        this.addDependency(realPath)
        const ext = path.extname(match)
        const name = path.basename(match, ext)
        const imgContent = await utils.readFile(realPath)
        const hash = options.name.match(hashReg)?.[0] || defaultHash

        const args = [
          this,
          imgContent,
          {
            name: path.dirname(options.name) + `/${name}.${hash}${ext}`
          }
        ]
        utils.fileLoader(...args)
        const imgEmitName = utils.getEmitName(...args)
        return path.posix.relative(contentEmitDir, imgEmitName)
      }
      return match
    }
  )

  return utils.fileLoader(this, newContent, options)
}
