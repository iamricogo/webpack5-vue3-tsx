import { InjectionKey } from 'vue'
import { Store, useStore as baseUseStore, createStore } from 'vuex'
import app, { IAppState } from './modules/app'
import createPersistedState from 'vuex-persistedstate'

export interface IRootState {
  app: IAppState
}

// 定义 injection key
export const key: InjectionKey<Store<IRootState>> = Symbol()

const vuexLocal = createPersistedState({
  reducer({ app: { language } }: IRootState): {
    app: Partial<IAppState>
  } {
    return {
      app: {
        language
      }
    }
  }
})

const root = createStore<IRootState>({
  plugins: [vuexLocal],
  modules: {
    app
  }
})

export default root

// 定义自己的 `useStore` 组合式函数
export const useStore = (): Store<IRootState> => baseUseStore(key)
