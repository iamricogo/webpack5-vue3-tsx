import { Language } from '@/lang'
import { Transition, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import router from '@/router'
import style from './style.module.scss'

export default defineComponent({
  name: 'Layout',
  setup: () => {
    const lanConfig: Record<Language, string> = {
      'en-US': 'English',
      'zh-CN': '中文'
    }

    const {
      state: { app },
      commit
    } = useStore()

    const route = useRoute()

    return () => (
      <div class={[style['app-wrapper']]}>
        <div class={[style['main-container']]}>
          <header>
            <>
              菜单：
              <select
                v-model={route.meta.title}
                onChange={() => {
                  router.push({ name: route.meta.title as string })
                }}
              >
                {['home', 'others'].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </>
            <>
              语言：
              {app.language}
              <select
                v-model={app.language}
                onChange={() => {
                  commit('app/SET_LANGUAGE', app.language)
                }}
              >
                {Object.entries(lanConfig).map(([locale, label]) => (
                  <option key={locale} value={locale}>
                    {label}
                  </option>
                ))}
              </select>
            </>
          </header>
          <main>
            <router-view
              v-slots={{
                // eslint-disable-next-line
                default: ({ Component }: any) => (
                  <Transition name="fade-transform" mode="out-in">
                    <Component />
                  </Transition>
                )
              }}
            />
          </main>
          <footer>我是尾部</footer>
        </div>
      </div>
    )
  }
})
