import { Tag } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useI18n } from '@/lang'
import AppTypes, { func } from '@/vue-types'
import Service from './service'
import logo from '@/assets/images/logo.png'
export type IMeProps = ExtractOutPropTypes<typeof iMeProps>

export const iMeProps = {
  title: AppTypes.string.isRequired,
  onTap: func<(value: number) => void>()
}

export default defineComponent({
  name: 'Home',
  setup: () => {
    const { t } = useI18n()
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
    return () => (
      <div>
        <Tag color="purple">{t('hello')}</Tag>
        <img alt="Vue logo" src={logo} onClick={onSubmit} />
      </div>
    )
  }
})
