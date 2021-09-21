const fs = require('fs')
const loaderUtils = require('loader-utils')

const replaceAsync = async (str, regex, asyncFn) => {
  const promises = []
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args)
    promises.push(promise)
  })
  const data = await Promise.all(promises)

  return str.replace(regex, () => data.shift())
}

const readFile = (dir, type) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dir, type, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const fileLoader = (loaderContext, content, options = {}) => {
  options = Object.assign(
    {},
    loaderUtils.getOptions(loaderContext) || {},
    options
  )

  const emitName =
    options.emitName || getEmitName(loaderContext, content, options)

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(emitName)}`

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url, loaderContext.resourcePath, context)
    } else {
      publicPath = `${
        options.publicPath.endsWith('/')
          ? options.publicPath
          : `${options.publicPath}/`
      }${url}`
    }

    publicPath = JSON.stringify(publicPath)
  }

  if (options.postTransformPublicPath) {
    publicPath = options.postTransformPublicPath(publicPath)
  }

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    loaderContext.emitFile(emitName, content)
  }

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true

  // 返回模块化内容
  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`
}

const getEmitName = (loaderContext, content, options = {}) => {
  options = Object.assign(
    {},
    loaderUtils.getOptions(loaderContext) || {},
    options
  )
  const context = options.context || loaderContext.rootContext
  const url = loaderUtils.interpolateName(
    loaderContext,
    options.name || '[contenthash].[ext]',
    {
      context,
      content,
      regExp: options.regExp
    }
  )

  let emitName = url
  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      emitName = options.outputPath(url, loaderContext.resourcePath, context)
    } else {
      emitName = path.posix.join(options.outputPath, url)
    }
  }

  return emitName
}

//像 require 表达式一样解析一个 request 。
const resolve = (loaderContext, request, context) => {
  context = context || loaderContext.context
  return new Promise((resolve, reject) => {
    loaderContext.resolve(context, request, (err, result) => {
      resolve(result)
    })
  })
}

module.exports = {
  replaceAsync,
  readFile,
  fileLoader,
  getEmitName,
  resolve
}
