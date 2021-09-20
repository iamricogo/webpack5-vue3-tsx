import { defineComponent } from 'vue'
import { useStore } from '@/store'
import createStore from '@/store/provide'
export default defineComponent({
  name: 'App',
  setup: () => {
    createStore()
    const {
      state: {
        app: { adapter }
      }
    } = useStore()
    return () => (
      <div
        id="views"
        style={{
          //width: `${100/$store.state.scale}%`,
          //height: `${100/$store.state.scale}%`,
          width: `${adapter.width}px`,
          height: `${adapter.height}px`,
          transform: `translate(-50%,-50%) scale(${adapter.scale})`
        }}
      >
        <router-view />
      </div>
    )
  }
})
