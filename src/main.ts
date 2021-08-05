import { createApp } from 'vue'
import App from '@/App'
import Ant from '@/plugins/ant-design-vue'
import '@/styles/index.scss'
const app = createApp(App)
app.use(Ant).mount('#app')
export default app
