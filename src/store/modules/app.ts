import { IRootState } from '../'
import { Language, setI18nLanguage } from '@/lang'
import { Module } from 'vuex'
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
      setI18nLanguage(language)
      state.language = language
    }
  }
}

export default app
