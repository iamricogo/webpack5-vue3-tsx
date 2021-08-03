import { Plugin } from 'vue' // App是类型

const Ant: Plugin = {
  install: () => {
    require('ant-design-vue/dist/antd.css')
  }
}

export default Ant
