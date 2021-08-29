export default class MathUtils {
  static scientificNotationToString(number: number): string {
    const strParam = String(number).replace(/^-/, '')
    if (!/e/.test(strParam)) return strParam

    // 指数
    const index = Number(strParam.match(/\d+$/)?.[0])
    // 基数
    const basis = strParam.match(/^[\d\.]+/)?.[0].replace(/\./, '') || ''

    return (number >= 0 ? '#' : '-#').replace(
      '#',
      /e\+/.test(strParam)
        ? basis.padEnd(index + 1, '0')
        : basis.padStart(index + basis.length, '0').replace(/^0/, '0.')
    )
  }

  static numberFormat(
    number: number,
    options: {
      precision?: number //小数点位数
      zeroPadding?: boolean //是否进行补领操作
      mode?: 'round' | 'ceil' | 'floor' | 'cut-off' //处理模式，四舍五入，入，舍
      symbol?: string //金额标识，传$等货币符号可拼接在前，默认为空
      separator?: string //分割符号，按groups规则对整数位进行分割，默
      decimal?: string //小数点的符号，默认英文'.'
      groups?: RegExp //整数位分割规则，默认千分位，每三位用separator符号进行分割
    } = {}
  ): string {
    const { precision, mode, symbol, decimal, groups, separator, zeroPadding } =
      Object.assign(
        {
          symbol: '',
          precision: 2,
          zeroPadding: true,
          mode: 'cut-off', //默认截取模式
          separator: ',',
          decimal: '.',
          groups: /(\d)(?=(\d{3})+\b)/g
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
    const split = this.scientificNotationToString(value)
        .replace(/^-/, '')
        .split('.'),
      dollars = split[0],
      cents = (split[1] || '').padEnd(zeroPadding ? precision : 0, '0')

    return (value >= 0 ? '!#' : '-!#')
      .replace('!', symbol)
      .replace(
        '#',
        dollars.replace(groups, '$1' + separator) +
          (cents ? decimal + cents : '')
      )
  }
}
