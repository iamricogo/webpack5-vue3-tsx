import Big, { BigSource } from 'big.js'

const reduce =
  (func: (a: BigSource, b: BigSource) => number) =>
  (...args: BigSource[]) =>
    args.reduce((count, item, index) => {
      if (index === 0) return count
      return func(count, item)
    }, args[0]) as number

export const plus = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).plus(new Big(b)).toNumber()
)

export const minus = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).minus(new Big(b)).toNumber()
)

export const div = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).div(new Big(b)).toNumber()
)

export const times = reduce((a: BigSource, b: BigSource): number =>
  new Big(a).times(new Big(b)).toNumber()
)
