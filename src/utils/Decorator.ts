import { DebounceSettings, debounce } from 'lodash'
declare type MethodDecorator<T = unknown> = (
  target: T,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => PropertyDescriptor | void

export const Debounce =
  <T>(wait: number, options: DebounceSettings = {}): MethodDecorator<T> =>
  (target, propertyKey, descriptor) => {
    Object.assign(descriptor, {
      value: debounce(descriptor.value, wait, options)
    })
    return descriptor
  }
