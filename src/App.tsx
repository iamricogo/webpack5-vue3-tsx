import { defineComponent } from 'vue'
import createStore from '@/store/provide'
export default defineComponent({
  name: 'App',
  setup: () => {
    createStore()
    return () => <router-view />
  }
})
