import { defineComponent, provide, reactive, readonly, ref } from 'vue'

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
    const location = ref('North Pole')
    const geolocation = reactive<Geolocation>({
      longitude: 90,
      latitude: 135
    })

    const updateProvide = {
      location: (value: string): void => {
        location.value = value
      },
      geolocation: ({ longitude, latitude }: Geolocation): void => {
        geolocation.longitude = longitude
        geolocation.latitude = latitude
      }
    }
    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateProvide', readonly(updateProvide))
    return () => <router-view />
  }
})
