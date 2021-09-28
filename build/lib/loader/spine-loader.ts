import loaderUtils from 'loader-utils'
import fileLoader from 'file-loader'
import path from 'path'
import { LoaderDefinitionFunction } from 'webpack'
import utils from './utils'
import spritesLoader from './sprites-loader'

const spineLoader: LoaderDefinitionFunction = async function (content) {
  const options = utils.optionsFormat(this)
  //应用格式化后的options
  utils.updateOptions(this, options)

  const atlasSrc = this.resourcePath.replace('.spine.json', '.atlas')

  this.addDependency(atlasSrc)

  const atlasContent = await utils.readFile(atlasSrc, 'utf-8')

  //配置spritesLoader只返回文件内容
  utils.updateOptions(this, {
    getFileContent: true
  })

  //拿到替换过内容后的atlas文件内容（能反应内部依赖的资源的变化）
  const newAtlasContent = await spritesLoader.call(this, atlasContent)

  //json + 新atlas组成的内容计算hash

  const assetsName = loaderUtils.interpolateName(this, options.name, {
    content: content + newAtlasContent
  })

  const ext = path.extname(this.resourcePath)

  //更新为atlas的配置
  utils.updateOptions(this, {
    name: assetsName.replace(new RegExp(`\\${ext}$`), '.atlas')
  })
  //输出atlas文件
  fileLoader.call(this, newAtlasContent)

  //更新为原文件的配置
  utils.updateOptions(this, {
    name: assetsName
  })
  return fileLoader.call(this, content)
}

export default spineLoader
