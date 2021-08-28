export default class MathUtils {
  static round(number: number, precision = 0): number {
    return (
      Math.round(Number(+number + 'e' + precision)) / Math.pow(10, precision)
    )
  }
}
