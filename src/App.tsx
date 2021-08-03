import { defineComponent, ref, reactive, Slots } from 'vue'
import Me, { IMeProps } from '@/components/Me'
import Others, { IOthersProps } from '@/components/Others'
import IButton, { IButtonProps, IType } from '@/components/Button'
import { Tabs, TabPane } from 'ant-design-vue'
interface ComData {
  props: IMeProps & IOthersProps & IButtonProps
  slots?: Slots
}
type Coms = {
  [key in 'Me' | 'Others' | 'IButton']: ComData
}
export default defineComponent({
  name: 'App',
  setup: () => {
    const active = ref<keyof Coms>('Me')
    const coms: Coms = {
      Me: {
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
        props: reactive<IOthersProps>({
          title: 'Others'
        })
      },
      IButton: {
        props: reactive<IButtonProps>({
          type: IType.danger
        })
      }
    }

    return () => (
      <>
        <Tabs type="card" v-model={[active.value, 'activeKey']}>
          {Object.entries(coms).map(([key, value]) => {
            const { props, slots } = value
            return (
              <TabPane tab={key} key={key}>
                {
                  {
                    Me: <Me title={props.title} v-slots={slots} onTap={props.onTap} />,
                    Others: <Others title={props.title} />,
                    IButton: <IButton type={props.type} />
                  }[key]
                }
              </TabPane>
            )
          })}
        </Tabs>
      </>
    )
  }
})
