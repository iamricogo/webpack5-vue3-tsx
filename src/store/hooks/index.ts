import { inject, reactive, watch } from 'vue'
import { merge } from 'lodash'
import PersistedState from '@/utils/PersidtedState'
interface State {
  count: number
}

export const key = Symbol()

export interface Store {
  state: State
  getters: {
    doubleCount: number
  }
  mutations: {
    updateState: (newState: Partial<State>) => void
  }
}

export const useCreateStore = (): { store: Store; key: typeof key } => {
  const store = reactive<Store>({
    state: {
      count: 0
    },
    mutations: {
      updateState: (newState: Partial<State> = {}) => {
        console.warn(newState)
        merge(store.state, newState)
      }
    },
    get getters() {
      const state = store.state
      return {
        get doubleCount(): number {
          return state.count * 2
        }
      }
    }
  })

  const persidtedState = new PersistedState<State>({
    state: store.state,
    reducer: ({ count }) => ({ count })
  })

  watch(store.state, () => {
    persidtedState.update()
  })

  return {
    store,
    key
  }
}

export const useStore = (): Store => inject<Store>(key) as NonNullable<Store>
