import { IRootState } from '../'
import { Module } from 'vuex'
import i18n, { Language } from '@/lang'

export interface IAppState {
  language: Language
}

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: {
    language: 'en-US'
  },
  mutations: {
    SET_LANGUAGE(state, language: Language) {
      state.language = language
      i18n.global.locale = language

      console.log(i18n)
    }
  }
}

export default app
