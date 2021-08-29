import { InjectionKey, inject, provide, reactive, readonly } from 'vue'
import { merge } from 'lodash'
interface State {
  count: number
}

export const key: InjectionKey<Store> = Symbol()

export interface Store {
  state: State
  mutations: {
    updateState: (newState: Partial<State>) => void
  }
}

const createStore = (): void => {
  const store = reactive<Store>({
    state: {
      count: 0
    },
    mutations: {
      updateState: (newState: Partial<State> = {}) => {
        console.warn(newState)
        merge(store.state, newState)
      }
    }
  })

  provide(key, readonly(store))
}

export default createStore

export const useStore = (): Store => inject<Store>(key) as NonNullable<Store>
