import loaderUtils from 'loader-utils'
import path from 'path'
import { LoaderDefinitionFunction } from 'webpack'
import fileLoader from 'file-loader'
import utils from './utils'

const spritesLoader: LoaderDefinitionFunction = async function (content) {
  const defaultHash = `[md4:contenthash:hex:20]`
  const options = Object.assign(
    {
      //默认同步webpack5 hash算法默认规则
      name: `assets/[name].${defaultHash}.[ext]`
    },
    loaderUtils.getOptions(this)
  )
  utils.updateOptions(this, options)

  const imgReg = /(\w|-|~|@|\/)+\.(png|jpe?g)/g
  const hashReg =
    /\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi

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
        const imgContentName =
          path.dirname(options.name) +
          `/${name}.${hash}${ext}`.replace(
            /\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi,
            (all, hashType, digestType, maxLength) =>
              loaderUtils.getHashDigest(
                imgContent,
                hashType,
                digestType,
                parseInt(maxLength, 10)
              )
          )
        //定义为输出的图片的配置
        utils.updateOptions(this, {
          name: imgContentName
        })
        //调用fileLoader进行匹配的图片资源输出
        fileLoader.call(this, imgContent)

        return path.posix.basename(imgContentName)
      }
      return match
    }
  )

  //还原配置
  utils.updateOptions(this, options)

  //调用fileLoader进行源文件（已替换资源路径）输出
  return fileLoader.call(this, newContent)
}

export default spritesLoader
