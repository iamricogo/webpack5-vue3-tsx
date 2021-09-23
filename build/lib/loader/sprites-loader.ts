import loaderUtils from 'loader-utils'
import path from 'path'
import { LoaderDefinitionFunction } from 'webpack'
import fileLoader from 'file-loader'
import utils from './utils'

const spritesLoader: LoaderDefinitionFunction = async function (content) {
  const options = utils.optionsFormat(this)
  //应用格式化后的options
  utils.updateOptions(this, options)
  const imgReg = /(\w|-|~|@|\/)+\.(png|jpe?g)/gi
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
        const hash = utils.hashPlacehoderUtils.completion(
          this,
          options.name.match(utils.hashPlacehoderUtils.match)?.[0] ||
            '[contenthash]'
        )

        const imgContentName = loaderUtils.interpolateName(
          this,
          path.dirname(options.name) + `/${name}.${hash}${ext}`,
          {
            content: imgContent
          }
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
