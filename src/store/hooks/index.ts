import { inject, reactive, watch } from 'vue'
import { merge } from 'lodash'
import PersistedState from '@/utils/PersistedState'
interface State {
  count: number
  deep: {
    persisted: number
    normal: number
  }
  deep2: {
    persisted: number
    normal: number
  }
}

export const key = Symbol()

export interface Store {
  state: State
  getters: {
    doubleCount: number
  }
  mutations: {
    updateState: (newState: DeepPartial<State>) => void
  }
}

export const useCreateStore = (): { store: Store; key: typeof key } => {
  const store: Store = {
    state: reactive<State>({
      count: 0,
      deep: {
        persisted: 0,
        normal: 0
      },
      deep2: {
        persisted: 0,
        normal: 0
      }
    }),
    mutations: {
      updateState: (newState: DeepPartial<State> = {}) => {
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
  }

  const persistedState = new PersistedState<State>({
    state: store.state,
    reducer: ({ count, deep: { persisted } }) => ({
      count,
      deep: { persisted }
    })
  })

  watch(store.state, () => {
    persistedState.update()
  })

  return {
    store,
    key
  }
}

export const useStore = (): Store => inject<Store>(key) as NonNullable<Store>
