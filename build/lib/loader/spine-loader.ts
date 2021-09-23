import loaderUtils from 'loader-utils'
import fileLoader from 'file-loader'
import { LoaderDefinitionFunction } from 'webpack'
import utils from './utils'
import spritesLoader from './sprites-loader'

const spineLoader: LoaderDefinitionFunction = async function (content) {
  const defaultHash = `[md4:contenthash:hex:20]`
  const options = Object.assign(
    {
      //默认同步webpack5 hash算法默认规则
      name: `assets/[name].${defaultHash}.[ext]`
    },
    loaderUtils.getOptions(this)
  )
  utils.updateOptions(this, options)

  const atlasSrc = this.resourcePath.replace('.spine.json', '.atlas')

  this.addDependency(atlasSrc)

  const atlasContent = await utils.readFile(atlasSrc, 'utf-8')
  //json+atlas组成的内容计算hash
  const assetsName = options.name.replace(
    /\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi,
    (all, hashType, digestType, maxLength) =>
      loaderUtils.getHashDigest(
        content + atlasContent,
        hashType,
        digestType,
        parseInt(maxLength, 10)
      )
  )

  //更新为atlas的配置
  utils.updateOptions(this, {
    name: assetsName.replace('.[ext]', '.atlas')
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
