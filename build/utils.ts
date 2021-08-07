import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin'
import { RuleSetRule } from 'webpack'
import chalk from 'chalk'
import os from 'os'

export const _typeof = (context: unknown): string =>
  Object.prototype.toString.call(context).slice(8, -1).toLowerCase()

export const isDev = (): boolean => process.env.NODE_ENV === 'development'

/**
 * @param {string} key 
 *  can't find    =>undefined
        --key         =>true
        --key=value   =>value
        --key value   =>value
 * @returns 
 */
export const getParamsByKey = (key: string): string => {
  let value = undefined
  for (let index = 0; index < process.argv.length; index++) {
    const cur = process.argv[index],
      next = process.argv[index + 1]
    if (new RegExp(`^--${key}(=\\w+)?$`).test(cur)) {
      if (new RegExp(`^--${key}$`).test(cur)) {
        //--key value
        value =
          !next || (next && new RegExp(`^--\\w+(=\\w+)?$`).test(next))
            ? true
            : next
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
 * @param loaderName
 * @param options
 * @returns
 */
export const createCssLoader = (
  loaderName: 'sass' | 'less' = 'sass',
  options: { extract?: Record<string, unknown> | boolean } = {}
): RuleSetRule['use'] => {
  const { extract, modules } = Object.assign(
    {
      extract: !isDev(),
      modules: {
        localIdentName: isDev() ? '[path][name]__[local]' : '[hash:base64]',
        auto: true
      }
    },
    options
  )
  const preLoader = {
    less: {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true;`
          }
        }
      }
    },
    sass: 'sass-loader'
  }

  const loaders = [
    extract
      ? {
          loader: MiniCssExtractLoader,
          options: Object.assign(
            {
              publicPath: '../'
            },
            _typeof(extract) === 'object' ? extract : {}
          )
        }
      : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        // Run `postcss-loader` on each CSS `@import` and CSS modules/ICSS imports, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
        // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
        importLoaders: 1,
        modules
      }
    },
    'postcss-loader',
    typeof loaderName === 'string' ? preLoader[loaderName] : loaderName
  ]

  return loaders
}

export const getServerUrls = (host: string, port: number): string =>
  chalk.cyan(`Webpack`) +
  chalk.green(
    ` dev server running at:\n${Object.values(os.networkInterfaces())
      .flatMap((nInterface) => nInterface ?? [])
      .filter((detail) => detail.family === 'IPv4')
      .filter((detail) =>
        host === '0.0.0.0' ? true : detail.address.includes('127.0.0.1')
      )
      .sort((a, b) => {
        const aIsLocal = a.address.includes('127.0.0.1')
        const bIsLocal = b.address.includes('127.0.0.1')
        if (aIsLocal && !bIsLocal) {
          return -1
        }
        return 0
      })
      .map((detail) => {
        const type = detail.address.includes('127.0.0.1')
          ? 'Local:   '
          : 'Network: '
        const host = detail.address.replace('127.0.0.1', 'localhost')
        const url = `http://${host}:${chalk.bold(port)}`
        return `  > ${type} ${chalk.cyan(url)}`
      })
      .join(`\n`)}`
  )
