import { defineComponent, ExtractPropTypes, PropType } from 'vue'
import logo from '@/assets/logo.png'
import style from './style.module.scss'
import { Tag } from 'ant-design-vue'
export type IMeProps = Partial<ExtractPropTypes<typeof iMeProps>>

export const iMeProps = {
  title: {
    type: String,
    required: true
  },
  onTap: {
    type: Function as PropType<(value: number) => void>,
    default: null
  }
}

export default defineComponent({
  name: 'Me',
  props: iMeProps,
  emits: {
    tap: (value: number) => typeof value != 'undefined'
  },
  slots: ['title'],

  setup: (props: IMeProps, { emit, slots }) => {
    return () => (
      <div>
        <Tag color="purple">{props.title}</Tag>
        <h5>{slots.title && slots.title()}</h5>
        <img
          alt="Vue logo"
          src={logo}
          onClick={() => {
            emit('tap', 1)
          }}
        />
        <div class={style['img-box']}></div>
      </div>
    )
  }
})
