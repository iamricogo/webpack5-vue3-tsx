<template>
  <div class="others-pages">
    <tag>others</tag>

    <p>state.deep.persisted:{{ store.state.deep.persisted }}</p>
    <p>state.deep.normal:{{ store.state.deep.normal }}</p>

    <button @click="plus">+</button>
    <button @click="minus">-</button>
  </div>
</template>
<script lang="ts">
import { Tag } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useStore } from '@/store/hooks'

export default defineComponent({
  name: 'Others',
  components: {
    Tag
  },
  setup: () => {
    const store = useStore()
    return { store }
  },
  methods: {
    plus() {
      const {
        state: {
          deep: { persisted, normal }
        },
        mutations: { updateState }
      } = this.store
      updateState({
        deep: { persisted: persisted + 1, normal: normal + 1 }
      })
    },
    minus() {
      const {
        state: {
          deep: { persisted, normal }
        },
        mutations: { updateState }
      } = this.store
      updateState({
        deep: { persisted: persisted - 1, normal: normal - 1 }
      })
    }
  }
})
</script>
<style lang="scss">
.others-pages {
  p {
    color: #d4380d;
    background: #fff2e8;
    border-color: #ffbb96;
  }
}
</style>
