import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin'
import { RuleSetRule } from 'webpack'
import { _typeof, isDev, isWindows } from './shared'
import { join } from 'path'

const genTranspileDepRegex = (
  transpileDependencies: Array<string | RegExp>
): RegExp | null => {
  const deps = transpileDependencies.map((dep) => {
    if (typeof dep === 'string') {
      const depPath = join('node_modules', dep, '/')
      return isWindows
        ? depPath.replace(/\\/g, '\\\\') // double escape for windows style path
        : depPath
    } else if (dep instanceof RegExp) {
      return dep.source
    }
  })
  return deps.length ? new RegExp(deps.join('|')) : null
}

export const babelExclude = (
  filepath: string,
  transpileDependencies: Array<string | RegExp> = []
): boolean => {
  const transpileDepRegex = genTranspileDepRegex(transpileDependencies)

  // always transpile js in vue files
  if (/\.vue\.jsx?$/.test(filepath)) {
    return false
  }

  // only include @babel/runtime when the @vue/babel-preset-app preset is used
  if (
    process.env.VUE_CLI_TRANSPILE_BABEL_RUNTIME &&
    filepath.includes(join('@babel', 'runtime'))
  ) {
    return false
  }

  // check if this is something the user explicitly wants to transpile
  if (transpileDepRegex && transpileDepRegex.test(filepath)) {
    return false
  }
  // Don't transpile node_modules
  return /node_modules/.test(filepath)
}

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
      extract: !isDev,
      modules: {
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64]',
        auto: true
      }
    },
    options
  )

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
