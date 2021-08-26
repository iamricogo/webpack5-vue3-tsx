import { Ref, computed, defineComponent, inject, ref } from 'vue'
import { Tag } from 'ant-design-vue'
import { UpdateProvide } from '@/App'
import { useI18n } from '@/lang'
import Button, { IButtonProps } from '@/components/Button'
import Service from './service'
import logo from '@/assets/images/logo.png'

export default defineComponent({
  name: 'Home',
  setup: () => {
    const { t } = useI18n()

    const userLocation = inject<Ref<string>>('location', ref('The Universe'))
    const userUpdateProvide = inject<UpdateProvide>('updateProvide')
    const count = ref(0)

    const onSubmit = async () => {
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
    }

    const buttonPropsComputed = computed<IButtonProps>({
      get: () => ({
        label: userLocation.value,
        onTap: () => {
          userUpdateProvide?.location(++count.value + '')
        }
      }),
      set: (val) => console.log(val)
    })

    return () => (
      <div>
        <Tag color="purple">{t('hello')}</Tag>
        <Button {...buttonPropsComputed.value} />

        <img alt="Vue logo" src={logo} onClick={onSubmit} />
      </div>
    )
  }
})
