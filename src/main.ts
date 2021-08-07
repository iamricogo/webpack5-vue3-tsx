import '@/styles/index.scss'
import { createApp } from 'vue'
import Ant from '@/plugins/ant-design-vue'
import App from '@/App'
const app = createApp(App)
app.use(Ant).mount('#app')
export default app
