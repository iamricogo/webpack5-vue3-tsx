import { Store } from '@/store/provide'
import { Tag } from 'ant-design-vue'
import { debounce } from 'lodash'
import { defineComponent, inject, reactive } from 'vue'
import { useI18n } from '@/lang'
import Animation, { Ease } from '@/utils/Animation'
import Button from '@/components/Button'
import MathUtils from '@/utils/MathUtils'
import Service from './service'
import logo from '@/assets/images/logo.png'
import style from './style.module.scss'
export default defineComponent({
  name: 'Home',
  setup: () => {
    const { t } = useI18n()

    const {
      state,
      mutations: { updateState }
    } = inject<Store>('store') as NonNullable<Store>

    const onSubmit = debounce(async () => {
      try {
        const {
          data: { data: provinceList = [] }
        } = await Service.getProvinceList()
        console.log(provinceList)

        await Service.submit({
          name: 'name',
          email: 'email',
          mobile_number: 'mobile_number',
          comment: 'comment'
        }).finally(() => {
          console.log('finally')
        })

        console.log('submit:success')
      } catch (error) {
        console.log(error)
      }
    }, 300)

    const buttonStyle = reactive({
      transform: `translate3d(0,0,0)`
    })

    const onButtonTap = debounce(() => {
      const start = state.count
      new Animation({ count: start })
        .to({ count: state.count + 60 }, 10 * 1000, Ease.bounce)
        .on('update', ({ count }, progress) => {
          updateState({ count: MathUtils.round(count) })

          const r = 100
          const times = 1

          const point = {
            x: r,
            y: 0
          }

          const d = Math.PI * 2 * times * progress

          const x = point.x - Math.cos(d) * r

          const y = -point.y - Math.sin(d) * r

          buttonStyle.transform = `translate3d(${x}px,${y}px,0)`
        })
    }, 300)

    return () => (
      <div class={[style.home]}>
        <Tag color="purple">{t('hello')}</Tag>
        <div>
          <img alt="Vue logo" src={logo} onClick={onSubmit} />
          <Button
            label={String(state.count)}
            onTap={onButtonTap}
            style={buttonStyle}
          />
        </div>
      </div>
    )
  }
})
