import { isDev } from './shared'
import chalk from 'chalk'
import os from 'os'

const rules = [
  {
    type: 'cant-resolve-loader',
    re: /Can't resolve '(.*loader)'/,
    msg: (e, match) =>
      `Failed to resolve loader: ${chalk.yellow(match[1])}\n` +
      `You may need to install it.`
  }
]

export const transformer = (
  error: Record<string, Record<string, string>>
): unknown => {
  if (error.webpackError) {
    const message =
      typeof error.webpackError === 'string'
        ? error.webpackError
        : error.webpackError.message || ''
    for (const { re, msg, type } of rules) {
      const match = message.match(re)
      if (match) {
        return Object.assign({}, error, {
          // type is necessary to avoid being printed as default error
          // by friendly-error-webpack-plugin
          type,
          shortMessage: msg(error, match)
        })
      }
    }
    // no match, unknown webpack error without a message.
    // friendly-error-webpack-plugin fails to handle this.
    if (!error.message) {
      return Object.assign({}, error, {
        type: 'unknown-webpack-error',
        shortMessage: message
      })
    }
  }
  return error
}

export const formatter = (errors: Record<string, unknown>[]): unknown[] => {
  errors = errors.filter((e) => e.shortMessage)
  if (errors.length) {
    return errors.map((e) => e.shortMessage)
  }
}

export const progressBarFormatter = (): string =>
  `${chalk.cyan.bold(`${isDev ? 'Compiling' : 'Building'} `)}${chalk.green.bold(
    ':bar'
  )}${chalk.cyan.bold(' :percent')} (:elapsed seconds)`

export const getServerUrls = (host: string, port: number): string =>
  chalk.cyan(`Webpack`) +
  chalk.green(
    ` dev server running at:\n${Object.values(os.networkInterfaces())
      .flatMap((nInterface) => (nInterface ? nInterface : []))
      .filter((detail) => detail.family === 'IPv4')
      .filter((detail) =>
        host === '0.0.0.0' ? true : detail.address.includes('127.0.0.1')
      )
      .sort((a, b) => {
        const rule = (detail) => (detail.address.includes('127.0.0.1') ? 0 : 1)
        return rule(a) - rule(b)
      })
      .map((detail) => {
        const type = detail.address.includes('127.0.0.1')
          ? 'Local:   '
          : 'Network: '
        const host = detail.address.replace('127.0.0.1', 'localhost')
        const url = `http://${host}:${chalk.bold(String(port))}`
        return `  > ${type} ${chalk.cyan(url)}`
      })
      .join(`\n`)}`
  )
