import { Slots, defineComponent, reactive, ref } from 'vue'
import { Tabs } from 'ant-design-vue'
import Me, { IMeProps } from '@/views/me'
import Others, { IOthersProps } from '@/views/others'

interface ComData {
  com: typeof Me | typeof Others
  props: IMeProps | IOthersProps
  slots?: Slots
}
type Coms = {
  [key in 'Me' | 'Others']: ComData
}
export default defineComponent({
  name: 'App',
  setup: () => {
    return () => (
      <div id="app">
        <router-view />
      </div>
    )
  }
})
