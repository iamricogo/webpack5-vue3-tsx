import { DefineComponent, Transition, defineComponent } from 'vue'
export default defineComponent({
  name: 'AppMain',
  setup: () => {
    return () => (
      <router-view
        v-slots={{
          default: ({ Component }: { Component: DefineComponent }) => (
            <Transition name="fade-transform" mode="out-in">
              <Component />
            </Transition>
          )
        }}
      />
    )
  }
})
