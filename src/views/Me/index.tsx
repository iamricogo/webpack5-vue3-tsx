import { Tag } from 'ant-design-vue'
import { defineComponent } from 'vue'
import AppTypes, { func } from '@/vue-types'
import logo from '@/assets/logo.png'
import style from './style.module.scss'
export type IMeProps = ExtractOutPropTypes<typeof iMeProps>

export const iMeProps = {
  title: AppTypes.string.isRequired,
  onTap: func<(value: number) => void>()
}

export default defineComponent({
  name: 'Me',
  props: iMeProps,
  setup: (props, { slots }) => {
    return () => (
      <div>
        <Tag color="purple">{props.title}</Tag>
        <h5
          onClick={() => {
            props.onTap?.(1)
          }}
        >
          {slots.title?.()}
        </h5>
        <img alt="Vue logo" src={logo} />
        <div class={style['img-box']}></div>
      </div>
    )
  }
})
