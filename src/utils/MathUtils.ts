import Big, { BigSource } from 'big.js'

const reduce =
  (func: (a: BigSource, b: BigSource) => number) =>
  (...args: number[]) =>
    args.reduce((count, item, index) => {
      if (index === 0) return count
      return func(count, item)
    }, args[0])

export const plus = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).plus(new Big(b)).toNumber()
)

export const minus = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).plus(new Big(b)).toNumber()
)

export const div = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).div(new Big(b)).toNumber()
)

export const times = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).times(new Big(b)).toNumber()
)

export const toString = (number: number): string => {
  const string = String(number)
  if (!/e/.test(string)) return string
  const strAbs = string.replace(/^-/, '')
  // 指数
  const index = Number(strAbs.match(/\d+$/)?.[0])
  // 基数
  const basis = strAbs.match(/^[\d\.]+/)?.[0].replace(/\./, '') || ''

  return (number >= 0 ? '#' : '-#').replace(
    '#',
    /e\+/.test(strAbs)
      ? basis.padEnd(index + 1, '0')
      : basis.padStart(index + basis.length, '0').replace(/^0/, '0.')
  )
}
interface numberFormatOptions {
  precision?: number //小数点位数
  zeroPadding?: boolean //是否进行补领操作
  mode?: 'round' | 'ceil' | 'floor' | 'cut-off' //处理模式，四舍五入，入，舍
  symbol?: string //金额标识，传$等货币符号可拼接在前，默认为空
  separator?: string //分割符号，按groups规则对整数位进行分割，默
  decimal?: string //小数点的符号，默认英文'.'
  groups?: RegExp //整数位分割规则，默认千分位，每三位用separator符号进行分割
}

export const numberFormat = (
  number: number,
  options: numberFormatOptions = {}
): string => {
  const { precision, mode, symbol, decimal, groups, separator, zeroPadding } =
    Object.assign(
      {
        symbol: '', //默认金额符号为空
        precision: 2, //默认保留2位小数
        zeroPadding: true, //默认开启补零操作
        mode: 'cut-off', //默认截取模式
        separator: ',', //默认整数位分隔符为英文逗号
        decimal: '.', //默认小数点符号为英文句号
        groups: /(\d)(?=(\d{3})+\b)/g //默认规则为每3位一分组
      },
      options
    )
  //处理精度
  const scale = Math.pow(10, precision)
  const value =
    Math[mode === 'cut-off' ? (number >= 0 ? 'floor' : 'ceil') : mode](
      number * scale
    ) / scale
  //分开处理整数位和小数位
  const split = toString(value).replace(/^-/, '').split('.'),
    dollars = split[0],
    cents = (split[1] || '').padEnd(zeroPadding ? precision : 0, '0')

  return (value >= 0 ? '!#' : '-!#')
    .replace('!', symbol)
    .replace(
      '#',
      dollars.replace(groups, '$1' + separator) + (cents ? decimal + cents : '')
    )
}
