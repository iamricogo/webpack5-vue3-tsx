/*
 * @Author: Rico
 * @Date: 2021-07-31 18:57:20
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 15:56:42
 * @Description:
 */
import { defineComponent, ref, reactive } from 'vue'
import Me from '@/components/Me'
import Others from '@/components/Others'
import { Tabs as VTabs, Tab as VTabPane } from 'vant'
import { Tabs as ATabs, TabPane as ATabPane, Tag as ATag } from 'ant-design-vue'
import { ElTabs, ElTabPane } from 'element-plus'
export default defineComponent({
  name: 'App',
  setup: () => {
    const active = ref('Me')

    const coms = [
      {
        com: Me,
        reset: reactive({
          title: 'Me',
          onTap: () => {
            console.log(1)
          }
        }),
        slots: reactive({
          title: () => <span>我是插槽</span>
        })
      },
      {
        com: Others,
        reset: reactive({
          title: 'Others'
        })
      }
    ]

    return () => (
      <div>
        <ATag color="lime">vant</ATag>
        <VTabs type="line" v-model={[active.value, 'active']}>
          {coms.map((item) => (
            <VTabPane title={item.reset.title} name={item.reset.title}>
              <item.com v-slots={item.slots} {...item.reset} />
            </VTabPane>
          ))}
        </VTabs>

        <ATag color="pink">ant-design-vue</ATag>
        <ATabs type="card" v-model={[active.value, 'activeKey']}>
          {coms.map((item) => (
            <ATabPane tab={item.reset.title} key={item.reset.title}>
              <item.com v-slots={item.slots} {...item.reset} />
            </ATabPane>
          ))}
        </ATabs>

        <ATag color="purple">element-plus</ATag>
        <ElTabs type="card" v-model={[active.value, 'model-value']}>
          {coms.map((item) => (
            <ElTabPane label={item.reset.title} name={item.reset.title}>
              <item.com v-slots={item.slots} {...item.reset} />
            </ElTabPane>
          ))}
        </ElTabs>
      </div>
    )
  }
})
