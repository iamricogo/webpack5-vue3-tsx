import '@/styles/index.scss'
import 'normalize.css'
import { createApp } from 'vue'
import Ant from '@/plugins/ant-design-vue'
import App from '@/App'
import i18n from '@/lang'
import router from '@/router'
import store, { key } from '@/store'
const app = createApp(App)

app.use(Ant).use(i18n).use(router).use(store, key).mount('#app')
export default app
