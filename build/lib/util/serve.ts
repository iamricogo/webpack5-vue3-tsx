import chalk from 'chalk'
import os from 'os'

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
        const rule = (detail) => (detail.address.includes('127.0.0.1') ? 0 : 1)
        return rule(a) - rule(b)
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
