/*
 * @Author: Rico
 * @Date: 2021-07-31 19:09:51
 * @LastEditors: Rico
 * @LastEditTime: 2021-07-31 22:40:27
 * @Description:
 */

import { defineComponent, ExtractPropTypes } from 'vue'

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
    return () => (
      <div>
        <h4>{props.title}</h4>others
      </div>
    )
  }
})
