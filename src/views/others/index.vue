<template>
  <div>
    <tag>others</tag>
    <p>{{ store.state.count }}</p>
    <button @click="reset">归零</button>
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
    reset() {
      this.store.mutations.updateState({ count: 0 })
    }
  }
})
</script>
