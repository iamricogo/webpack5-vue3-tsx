import { defineComponent, provide, readonly } from 'vue'
import useProvideStore from '@/store/provide'
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
    const store = useProvideStore()
    provide('store', readonly(store))
    return () => <router-view />
  }
})
