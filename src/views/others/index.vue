<template>
  <div class="others-pages">
    <tag>自建状态管理</tag>
    <p>store.state.deep.persisted:{{ store.state.deep.persisted }}</p>
    <p>store.state.deep.normal:{{ store.state.deep.normal }}</p>
    <button @click="plus">+</button>
    <button @click="minus">-</button>
    <br />
    <tag>vuex状态管理</tag>
    <p>$store.state.app.language:{{ $store.state.app.language }}</p>
  </div>
</template>
<script lang="tsx">
import { Tag } from 'ant-design-vue'
import { defineComponent, getCurrentInstance } from 'vue'
import { useStore } from '@/store/hooks'
let context!: unknown
export default defineComponent({
  name: 'Others',
  components: {
    Tag
  },
  setup: () => {
    const instance = getCurrentInstance()
    context = instance?.proxy
    const store = useStore()
    return { store }
  },
  /**
   * 不写template 也可以 配合 render 函数写结构render 函数里面可以用 options api 也可以用 组合式 api
   */
  // render() {
  //   return (
  //     <div class="others-pages">
  //       <tag>自建状态管理</tag>
  //       <p>store.state.deep.persisted:{this.store.state.deep.persisted}</p>
  //       <p>store.state.deep.normal:{this.store.state.deep.normal}</p>
  //       <button onClick={this.plus}>+</button>
  //       <button onClick={this.minus}>-</button>
  //       <br />
  //       <tag>vuex状态管理</tag>
  //       <p>$store.state.app.language:{this.$store.state.app.language}</p>
  //     </div>
  //   )
  // },
  methods: {
    plus() {
      console.log(this)
      console.log(this === context)
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
