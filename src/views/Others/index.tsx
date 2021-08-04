import { Tag } from 'ant-design-vue'
import { defineComponent, ExtractPropTypes, reactive } from 'vue'
import IButton from '@/components/Button'
import { delay, from } from 'rxjs'

export type IOthersProps = Partial<ExtractPropTypes<typeof iOthersProps>>

const iOthersProps = {
  title: {
    type: String,
    required: true
  }
}
export default defineComponent({
  name: 'Others',
  props: iOthersProps,
  setup: (props: IOthersProps) => {
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
