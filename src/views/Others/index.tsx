import { Tag } from 'ant-design-vue'
import { defineComponent, reactive } from 'vue'
import IButton from '@/components/Button'
import { delay, from } from 'rxjs'
import AppTypes from '@/vue-types'

export type IOthersProps = ExtractOutPropTypes<typeof iOthersProps>

const iOthersProps = {
  title: AppTypes.string.isRequired
}
export default defineComponent({
  name: 'Others',
  props: iOthersProps,
  setup: (props) => {
    const state = reactive({
      loading: false
    })

    return () => (
      <div>
        <Tag color="pink">{props.title}</Tag>
        <IButton
          loading={state.loading}
          onClick={() => {
            state.loading = true
            from(fetch('./head.json'))
              .pipe(delay(1000))
              .subscribe({
                next: (response) => {
                  from(response.json()).subscribe((val) => {
                    console.log(val)
                  })
                },
                complete: () => {
                  state.loading = false
                }
              })
          }}
        >
          点击加载
        </IButton>
      </div>
    )
  }
})
