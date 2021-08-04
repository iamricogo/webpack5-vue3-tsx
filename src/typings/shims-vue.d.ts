declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends {
    required: true
  }
    ? K
    : never
}[keyof T]

declare type UnRequiredKeys<T> = {
  [K in keyof T]: T[K] extends {
    required: true
  }
    ? never
    : K
}[keyof T]

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
  : [T] extends [import('vue').Prop<infer V, infer D>]
  ? unknown extends V
    ? D
    : V
  : T

declare type ExtractOutPropTypes<O> = {
  [K in RequiredKeys<O>]: InferPropType<O[K]>
} &
  {
    [K in UnRequiredKeys<O>]?: InferPropType<O[K]>
  }

declare type StyleValue = string | import('vue').CSSProperties | Array<StyleValue>
