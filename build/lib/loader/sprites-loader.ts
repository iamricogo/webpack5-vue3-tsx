import loaderUtils from 'loader-utils'
import path from 'path'
import { LoaderDefinitionFunction } from 'webpack'
import fileLoader from 'file-loader'
import utils from './utils'

const spritesLoader: LoaderDefinitionFunction = async function (content) {
  //统一操作换行符
  content = utils.doEOL(content)
  const options = utils.optionsFormat(this)
  //应用格式化后的options
  utils.updateOptions(this, options)
  //匹配资源的正则
  const urlReg = /[\w-~@/.]+\.[a-zA-Z]\w+/gi
  const newContent = await utils.replaceAsync(
    content,
    urlReg,
    async (match) => {
      const request = loaderUtils.urlToRequest(match)
      const realPath = await utils.resolve(this, request)
      if (realPath) {
        this.addDependency(realPath)
        const ext = path.extname(match)
        const name = path.basename(match, ext)
        const urlFileContent = await utils.readFile(realPath)
        const hash = utils.hashPlacehoderUtils.completion(
          this,
          options.name.match(utils.hashPlacehoderUtils.match)?.[0] ||
            '[contenthash]'
        )

        const imgContentName = loaderUtils.interpolateName(
          this,
          /**有hash和ext占位符号就只替换他们，否则用自建规则 */
          utils.hashPlacehoderUtils.match.test(options.name) &&
            /\.\[ext\]/gi.test(options.name)
            ? options.name
                .replace(/\[name\]/gi, name)
                .replace(/\.\[ext\]/gi, ext)
            : path.dirname(options.name) + `/${name}.${hash}${ext}`,
          {
            content: urlFileContent
          }
        )

        //定义为输出的图片的配置
        utils.updateOptions(this, {
          name: imgContentName
        })
        //调用fileLoader进行匹配的资源输出
        fileLoader.call(this, urlFileContent)

        return path.posix.basename(imgContentName)
      }
      return match
    }
  )
  if (options.getFileContent) {
    return newContent
  }
  //还原配置
  utils.updateOptions(this, options)

  //调用fileLoader进行源文件（已替换资源路径）输出
  return fileLoader.call(this, newContent)
}

export default spritesLoader
