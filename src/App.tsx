import { defineComponent, ref, reactive, Slots } from 'vue'
import Me, { IMeProps } from '@/views/me'
import Others, { IOthersProps } from '@/views/others'
import { Tabs } from 'ant-design-vue'

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
    const active = ref<keyof Coms>('Me')
    const coms: Coms = {
      Me: {
        com: Me,
        props: reactive<IMeProps>({
          title: 'Me',
          onTap: (v: number) => {
            console.log(v)
          }
        }),
        slots: reactive<Slots>({
          title: () => [<span>我是插槽</span>]
        })
      },
      Others: {
        com: Others,
        props: reactive<IOthersProps>({
          title: 'Others'
        })
      }
    }
    return () => (
      <>
        <Tabs type="card" v-model={[active.value, 'activeKey']}>
          {Object.entries(coms).map(([key, { props, slots, com: Com }]) => (
            <Tabs.TabPane tab={key} key={key}>
              <Com v-slots={slots} {...props} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </>
    )
  }
})
