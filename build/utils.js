const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports._typeof = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
/**
 * @param {string} key 
 *  can't find    =>undefined
        --key         =>true
        --key=value   =>value
        --key value   =>value
 * @returns 
 */
exports.getArgvByKey = (key) => {
  let value = undefined
  for (let index = 0; index < process.argv.length; index++) {
    const cur = process.argv[index],
      next = process.argv[index + 1]
    if (new RegExp(`^--${key}(=\\w+)?$`).test(cur)) {
      if (new RegExp(`^--${key}$`).test(cur)) {
        //--key value
        value = !next || (next && new RegExp(`^--\\w+(=\\w+)?$`).test(next)) ? true : next
      } else {
        //--key=value
        value = cur.split('=')[1]
      }
      break
    }
  }
  return value
}

/**
 *
 * @param {'scss'|'less'|Object} loaderName
 * @param {*} options
 * @returns
 */
exports.createCssLoader = (loaderName = 'scss', options = {}) => {
  const { modules, extract } = Object.assign({ modules: false, extract: false }, options)
  const preLoader = {
    less: {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true
        },
        modifyVars: {
          hack: `true;`
        }
      }
    },
    scss: 'sass-loader'
  }

  const loaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: modules
          ? Object.assign(
              {
                localIdentName: '[name]-[local]-[hash:base64:5]'
              },
              exports._typeof(modules) === 'object' ? modules : {}
            )
          : false
      }
    },
    'postcss-loader',
    typeof loaderName === 'string' ? preLoader[loaderName] : loaderName
  ]

  modules && loaders.unshift('css-modules-typescript-loader')

  loaders.unshift(
    extract
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: Object.assign(
            {
              publicPath: '../'
            },
            exports._typeof(extract) === 'object' ? extract : {}
          )
        }
      : 'style-loader'
  )

  return loaders
}
