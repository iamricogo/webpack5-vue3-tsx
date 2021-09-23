/**
 * 注入器组件，方便以组件形式调用provide，template写法中适用
 */
import { defineComponent, provide, readonly } from 'vue'
import AppTypes, { oneOfType } from '@/vue-types'
const iProviderProps = {
  storeKey: oneOfType([String, Number, Symbol]).isRequired,
  store: AppTypes.object.isRequired
}

export default defineComponent({
  name: 'Provider',
  props: iProviderProps,
  setup: (props, { slots }) => {
    provide(props.storeKey, readonly(props.store))
    return () => slots?.default?.()
  }
})
