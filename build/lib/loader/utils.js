const fs = require('fs')
const loaderUtils = require('loader-utils')
const isExists = (dir) => {
  return new Promise((resolve, reject) => {
    fs.access(dir, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

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

const emitFile = (loaderContext, content, options = {}) => {
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

  let outputPath = url
  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url, loaderContext.resourcePath, context)
    } else {
      outputPath = path.posix.join(options.outputPath, url)
    }
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`

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
    loaderContext.emitFile(outputPath, content)
  }

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true

  // 返回模块化内容
  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`
}

const getAssetsPath = (str) => {
  return str.match(/\"(.+?)\"/)[1]
}

//像 require 表达式一样解析一个 request 。
const reslove = (loaderContext, request) => {
  return new Promise((resolve, reject) => {
    loaderContext.resolve(loaderContext.context, request, (err, result) => {
      resolve(result)
    })
  })
}

module.exports = {
  isExists,
  replaceAsync,
  readFile,
  emitFile,
  getAssetsPath,
  reslove
}
