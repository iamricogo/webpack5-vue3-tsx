import { defineComponent } from 'vue'
import { useStore } from '@/store/vuex'

export default defineComponent({
  name: 'Adapter',
  setup: (props, { slots }) => {
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
        {slots?.default?.()}
      </div>
    )
  }
})
