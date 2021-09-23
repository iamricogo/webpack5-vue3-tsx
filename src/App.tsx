import { defineComponent } from 'vue'
import { useCreateStore } from '@/store/hooks'
import Adapter from '@/components/Adapter'
import Provider from '@/components/Provider'
export default defineComponent({
  name: 'App',
  setup: () => {
    const { store, key } = useCreateStore()
    return () => (
      <Provider store={store} storeKey={key}>
        <Adapter>
          <router-view />
        </Adapter>
      </Provider>
    )
  }
})
