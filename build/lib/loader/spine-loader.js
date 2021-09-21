const loaderUtils = require('loader-utils')
const utils = require('./utils')
const spritesLoader = require('./sprites-loader')
module.exports = async function (content, options) {
  options = Object.assign(
    {
      name: 'assets/[name].[contenthash].[ext]'
    },
    loaderUtils.getOptions(this) || {},
    options
  )

  const atlasSrc = this.resourcePath.replace('.spine.json', '.atlas')

  this.addDependency(atlasSrc)

  const atlasContent = await utils.readFile(atlasSrc, 'utf-8')

  //输出atlas文件
  const atlasPublicPath = await spritesLoader.call(this, atlasContent, {
    name: options.name.replace('.[ext]', '.atlas')
  })

  //获取atlas文件的输出目录
  const atlasEmitPath = atlasPublicPath.match(/\"(.+?)\"/)[1]

  //json同步atlas目录
  return utils.fileLoader(this, content, {
    emitName: atlasEmitPath.replace('.atlas', '.json')
  })
}
