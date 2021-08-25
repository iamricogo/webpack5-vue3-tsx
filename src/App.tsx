import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  setup: () => {
    return () => (
      <div id="app">
        <router-view />
      </div>
    )
  }
})
