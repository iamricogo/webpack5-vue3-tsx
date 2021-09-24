import fs from 'fs'
import loaderUtils from 'loader-utils'
import { LoaderContext } from 'webpack'

const replaceAsync = async (
  str: string,
  regex: RegExp,
  asyncFn: (match, ...rest: string[]) => Promise<string>
): Promise<string> => {
  const promises = []
  str.replace(regex, (match, ...rest: string[]) => {
    const promise = asyncFn(match, ...rest)
    promises.push(promise)
    return match
  })

  const data = await Promise.all(promises)

  return str.replace(regex, () => data.shift())
}

const readFile = (dir: string, options?) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dir, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

//像 require 表达式一样解析一个 request 。
const resolve = (
  loaderContext: LoaderContext<unknown>,
  request,
  context?
): Promise<string | false> => {
  context = context || loaderContext.context
  return new Promise((resolve, reject) => {
    loaderContext.resolve(context, request, (err, result) => {
      resolve(result)
    })
  })
}

const updateOptions = (loaderContext: LoaderContext<unknown>, ...options) => {
  return Object.assign(loaderUtils.getOptions(loaderContext), ...options)
}

const hashPlacehoderUtils = {
  match:
    /\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi,

  /**
   * 用于将hash占位符格式化成完整的信息，需要的 hash 算法参数 优先取原占位符中的信息，其次取outputOptions信息，最后才是默认值
   * @param loaderContext loader上下文
   * @param path 需要替换的路径 [hashType:contenthash:digestType:maxLength]
   * @returns {string}
   */
  completion: (loaderContext: LoaderContext<unknown>, path: string): string => {
    const { hashDigest, hashDigestLength, hashFunction } =
      loaderContext?._compilation?.outputOptions || {}
    return path.replace(
      hashPlacehoderUtils.match,
      (all, hashType, digestType, maxLength) =>
        `[${hashType || hashFunction || 'md4'}:${[
          /(\[|\]|:)/g,
          hashType,
          digestType,
          maxLength
        ].reduce((pre, cur) => pre.replace(cur, ''), all)}:${
          digestType || hashDigest || 'hex'
        }:${maxLength || hashDigestLength || '20'}]`
    )
  }
}

/**
 * 用于options的一些默认处理
 * @param loaderContext loader上下文
 * @returns
 */
const optionsFormat = (loaderContext: LoaderContext<unknown>) => {
  const { assetModuleFilename } =
    loaderContext?._compilation?.outputOptions || {}
  const options = Object.assign(
    {
      name:
        typeof assetModuleFilename === 'string'
          ? assetModuleFilename
              .replace(/\[ext\]/gi, '.[ext]')
              .replace(/\[(chunkhash|fullhash)\]/gi, '[contenthash]')
          : `assets/[name].[contenthash].[ext][query]`
    },
    loaderUtils.getOptions(loaderContext)
  )

  return Object.assign({}, options, {
    name: hashPlacehoderUtils.completion(loaderContext, options.name)
  })
}

export default {
  hashPlacehoderUtils,
  optionsFormat,
  updateOptions,
  replaceAsync,
  readFile,
  resolve
}
