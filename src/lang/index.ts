import { I18n, createI18n } from 'vue-i18n'
import { Ref } from 'vue'
import enLocale from './en'
import store from '@/store'
import zhLocale from './zh-CN'

type MessageSchema = typeof enLocale

export type Language = 'en-US' | 'zh-CN'

const i18n = createI18n<[MessageSchema], Language>({
  legacy: false,
  locale: store.state.app.language,
  messages: {
    'en-US': {
      ...enLocale
    },
    'zh-CN': {
      ...zhLocale
    }
  }
})

export const setI18nLanguage = (
  locale: Language,
  instance: I18n = i18n
): void => {
  if (instance.mode === 'legacy') {
    instance.global.locale = locale
  } else {
    ;(instance.global.locale as Ref).value = locale
  }
}

export default i18n
export * from 'vue-i18n'
