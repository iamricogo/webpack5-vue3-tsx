import { defineComponent } from 'vue'
import AppTypes, { func } from '@/vue-types'
export type IButtonProps = ExtractPropTypesForOutside<typeof iButtonProps>

const iButtonProps = {
  label: AppTypes.string.isRequired,
  onTap: func<(e: Event) => void>().def(() => {
    console.log('我是默认的点击方法')
  })
}

export default defineComponent({
  name: 'Button',
  props: iButtonProps,
  setup: (props) => {
    return () => <button onClick={props.onTap}>{props.label}</button>
  }
})
