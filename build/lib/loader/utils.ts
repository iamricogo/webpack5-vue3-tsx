import fs from 'fs'
import loaderUtils from 'loader-utils'

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
const resolve = (loaderContext, request, context?): Promise<string | null> => {
  context = context || loaderContext.context
  return new Promise((resolve, reject) => {
    loaderContext.resolve(context, request, (err, result) => {
      resolve(result)
    })
  })
}

const updateOptions = (loaderContext, ...options) => {
  return Object.assign(loaderUtils.getOptions(loaderContext), ...options)
}

export default {
  updateOptions,
  replaceAsync,
  readFile,
  resolve
}
