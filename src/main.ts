/*
 * @Author: Rico
 * @Date: 2021-07-31 11:32:44
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 15:53:30
 * @Description:
 */
import { createApp } from 'vue'
import App from './App'
import 'element-plus/packages/theme-chalk/src/base.scss'
import 'ant-design-vue/dist/antd.css'
const app = createApp(App)
app.mount('#app')
export default app
