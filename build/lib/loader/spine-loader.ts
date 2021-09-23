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
  //json+atlas组成的内容计算hash

  const assetsName = loaderUtils.interpolateName(this, options.name, {
    content: content + atlasContent
  })

  const ext = path.extname(this.resourcePath)

  //更新为atlas的配置
  utils.updateOptions(this, {
    name: assetsName.replace(new RegExp(`\\${ext}$`), '.atlas')
  })
  //输出atlas文件
  await spritesLoader.call(this, atlasContent)
  //更新为原文件的配置
  utils.updateOptions(this, {
    name: assetsName
  })
  //json同步atlas目录
  return fileLoader.call(this, content)
}

export default spineLoader
