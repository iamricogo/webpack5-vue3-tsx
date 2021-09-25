import { IRootState } from '../'
import { Language, setI18nLanguage } from '@/lang'
import { Module } from 'vuex'
import { PartialDeep } from 'type-fest'
import { ScreenState } from '@/const'
import { merge } from 'lodash'
export interface IAppState {
  language: Language
  adapter: Adapter
}

interface Adapter {
  width: number
  height: number
  scale: number
  state: ScreenState
}

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: {
    language: 'en-US',
    adapter: {
      state: ScreenState.WEB,
      scale: 1,
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  mutations: {
    SET_LANGUAGE(state, language: Language) {
      setI18nLanguage(language)
      state.language = language
    },
    UPDATE_STATE(state, newState: PartialDeep<IAppState> | IAppState = {}) {
      merge(state, newState)
    }
  }
}

export default app
