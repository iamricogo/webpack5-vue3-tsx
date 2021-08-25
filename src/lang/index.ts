import { createI18n } from 'vue-i18n'
import enLocale from './en'
import store from '@/store'
import zhLocale from './zh-CN'

type MessageSchema = typeof enLocale

export type Language = 'en-US' | 'zh-CN'

const i18n = createI18n<Record<string, unknown>, MessageSchema, Language>({
  global: true,
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

export default i18n
export * from 'vue-i18n'
