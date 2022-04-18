declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare type StyleValue =
  | string
  | import('vue').CSSProperties
  | Array<StyleValue>

declare type InferPropType<T> = [T] extends [null]
  ? any
  : [T] extends [
      {
        type: null | true
      }
    ]
  ? any
  : [T] extends [
      | ObjectConstructor
      | {
          type: ObjectConstructor
        }
    ]
  ? Record<string, any>
  : [T] extends [
      | BooleanConstructor
      | {
          type: BooleanConstructor
        }
    ]
  ? boolean
  : [T] extends [
      | DateConstructor
      | {
          type: DateConstructor
        }
    ]
  ? Date
  : [T] extends [
      | (infer U)[]
      | {
          type: (infer U)[]
        }
    ]
  ? U extends DateConstructor
    ? Date | InferPropType<U>
    : InferPropType<U>
  : [T] extends [import('vue').Prop<infer V, infer D>]
  ? unknown extends V
    ? import('@vue/shared').IfAny<V, V, D>
    : V
  : T

declare type RequiredPropNames<PropsDef> = {
  [K in keyof PropsDef]: PropsDef[K] extends {
    required: true
  }
    ? K
    : never
}[Extract<keyof PropsDef, string>]

declare type ExtractPropTypesForOutside<Props> = {
  [K in RequiredPropNames<Props>]: InferPropType<Props[K]>
} & {
  [K in Exclude<keyof Props, RequiredPropNames<Props>>]?: InferPropType<
    Props[K]
  >
}
