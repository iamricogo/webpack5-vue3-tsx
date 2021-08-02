/*
 * @Author: Rico
 * @Date: 2021-07-31 19:09:51
 * @LastEditors: Rico
 * @LastEditTime: 2021-07-31 22:40:27
 * @Description:
 */

import { defineComponent } from 'vue'
export interface OthersProps {
  title: string
}
export default defineComponent({
  name: 'Others',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup: (props: OthersProps) => {
    return () => (
      <div>
        <h4>{props.title}</h4>others
      </div>
    )
  }
})
