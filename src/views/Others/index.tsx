import './style.css'
import { Tag } from 'ant-design-vue'
import { defineComponent } from 'vue'

import AppTypes from '@/vue-types'

export type IOthersProps = ExtractOutPropTypes<typeof iOthersProps>

const iOthersProps = {
  title: AppTypes.string.isRequired
}
export default defineComponent({
  name: 'Others',
  props: iOthersProps,
  setup: () => {
    return () => (
      <div>
        <Tag>{'others'}</Tag>
      </div>
    )
  }
})
