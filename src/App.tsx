import { defineComponent } from 'vue'
import createStore from '@/store/provide'
interface Geolocation {
  longitude: number
  latitude: number
}
export interface UpdateProvide {
  location: (value: string) => void
  geolocation: (value: Geolocation) => void
}
export default defineComponent({
  name: 'App',
  setup: () => {
    createStore()
    return () => <router-view />
  }
})
