import { I18n, createI18n } from 'vue-i18n'
import localeEn from './locales/en-US'
import localeZh from './locales/zh-CN'
import store from '@/store'

type MessageSchema = typeof localeEn

export const language = ['en-US', 'zh-CN'] as const

export type Language = typeof language[number]

const i18n = createI18n<
  [MessageSchema],
  Language,
  false,
  { legacy: false; messages: Record<Language, MessageSchema>; locale: Language }
>({
  legacy: false,
  locale: store.state.app.language,
  messages: {
    'en-US': {
      ...localeEn
    },
    'zh-CN': {
      ...localeZh
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
    ;(instance as typeof i18n).global.locale.value = locale
  }
}

export default i18n
export * from 'vue-i18n'
