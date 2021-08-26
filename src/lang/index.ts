import { I18n, createI18n } from 'vue-i18n'
import { Ref, WritableComputedRef } from 'vue'

import enLocale from './locales/en-US'
import store from '@/store'
import zhLocale from './locales/zh-CN'

type MessageSchema = typeof enLocale

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
    ;(instance as typeof i18n).global.locale.value = locale
  }
}

export default i18n
export * from 'vue-i18n'
