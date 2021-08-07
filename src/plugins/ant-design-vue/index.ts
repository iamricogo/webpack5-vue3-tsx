import { Plugin } from 'vue'
import { Tag } from 'ant-design-vue'

/**用于ant-design-vue插件全局重写 */
const Ant: Plugin = {
  install: () => {
    /**此处将原组件 props.color 的默认值进行了修改 */
    Object.assign(Tag, {
      props: {
        color: {
          default: 'volcano'
        }
      },
      mixins: [
        {
          created() {
            console.log(
              '欢迎使用ant-design-vue 的tag组件，我是全局扩展mixins重写demo'
            )
          }
        }
      ]
    })
  }
}

export default Ant
