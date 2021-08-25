import { Tag } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useI18n } from '@/lang'
import AppTypes, { func } from '@/vue-types'
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

    return () => (
      <div>
        <Tag color="purple">{t('hello')}</Tag>

        <img alt="Vue logo" src={logo} />
      </div>
    )
  }
})
