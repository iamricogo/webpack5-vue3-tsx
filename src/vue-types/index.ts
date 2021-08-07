import {
  VueTypeDef,
  VueTypeValidableDef,
  bool,
  createTypes,
  toType,
  toValidableType
} from 'vue-types'
export * from 'vue-types'

export default class AppTypes extends createTypes() {
  static maxLength(max: number): VueTypeDef<string> {
    return toType('maxLength', {
      type: String,
      validator: (v: string) => v.length <= max
    })
  }

  static get positive(): VueTypeValidableDef<number> {
    return toValidableType('positive', {
      type: Number,
      validator: (v: number) => v > 0
    })
  }

  static get style(): VueTypeValidableDef<StyleValue> {
    return toValidableType('style', {
      default: undefined,
      type: [String, Object]
    })
  }

  static get looseBool(): VueTypeValidableDef<boolean> {
    return bool().def(undefined)
  }
}
