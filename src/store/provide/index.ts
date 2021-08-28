import { merge } from 'lodash'
import { reactive } from 'vue'
interface State {
  count: number
}

export interface Store {
  state: State
  mutations: Record<string, (newState: Partial<State>) => void>
}

export default (): Store => {
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

  return store
}
