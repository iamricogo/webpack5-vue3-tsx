import { Tag } from 'ant-design-vue'
import { debounce } from 'lodash'
import { defineComponent, reactive, ref } from 'vue'
import { numberFormat } from '@/utils/FormatterUtils'
import { useI18n } from '@/lang'
import { useStore } from '@/store/provide'
import Animation, { Ease } from '@/utils/Animation'
import Button from '@/components/Button'
import Service from './service'
import style from './style.module.scss'

export default defineComponent({
  name: 'Home',
  setup: () => {
    const {
      state,
      getters,
      mutations: { updateState }
    } = useStore()
    const { t } = useI18n()
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

    let logoAnimation!: Animation
    const startPointData = {
      x: 0,
      y: 0,
      backgroundColor: 'transparent'
    }
    const points = ref([startPointData])
    const position = reactive({ x: 0, y: 0 })

    const logoMove = (progress: number): void => {
      const r = 100
      const times = 1

      const point = {
        x: r,
        y: 0
      }

      const d = Math.PI * 2 * times * progress

      const x = point.x - Math.cos(d) * r

      const y = -point.y - Math.sin(d) * r

      position.x = x
      position.y = y
      points.value.push({ x, y, backgroundColor: getRandomColor() })
    }

    const getRandomColor = () =>
      '#' +
      ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)

    const onButtonTap = debounce(() => {
      if (logoAnimation?.isAnimating) return
      const start = state.count,
        duration = 1000 * 10
      logoAnimation = new Animation({ count: start })
        .to({ count: state.count + 1000 * 10 }, duration, Ease.bounce)
        .on('update', ({ count }, progress) => {
          updateState({ count })
          console.log(getters.doubleCount)
          logoMove(progress)
        })
        .on('complete', () => {
          console.log('complete')
          // points.value = [startPointData]
        })
    }, 300)

    return () => (
      <div class={[style.home]}>
        <Tag color="purple">{t('hello')}</Tag>
        <div style={{ position: 'relative' }}>
          {points.value.map(({ x, y, backgroundColor }, i) => (
            <span
              key={i}
              class={[style.point]}
              style={{
                transform: `translate3d(${x}px,${y}px,0)`,
                backgroundColor
              }}
            ></span>
          ))}
          <span
            class={style.logo}
            style={{
              transform: `translate3d(${position.x}px,${position.y}px,0)`
            }}
            onClick={onSubmit}
          />
          <Button label={numberFormat(state.count)} onTap={onButtonTap} />
        </div>
      </div>
    )
  }
})
