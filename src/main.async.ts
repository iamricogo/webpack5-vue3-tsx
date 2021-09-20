import '@/styles/index.scss'
import 'normalize.css'
import { Application, utils } from 'pixi.js'
import { Events, ScreenState } from './const'
import { apps, emitter, resolution } from '@/context'
import { config } from '@/context/Resolution'
import { createApp } from 'vue'
import { loader } from '@/resources'

import Ant from '@/plugins/ant-design-vue'
import Size from './context/Size'
import i18n from '@/lang'
import router from '@/router'
import store, { key } from '@/store'

import App from '@/App'
import Scence from '@/Scence'

const init = () => {
  const initVue = () => {
    const app = createApp(App)
    app.use(Ant).use(i18n).use(router).use(store, key).mount('#app')
    apps.vue = app
  }

  const initPixi = () => {
    const options = {
      ...config.size,
      ...(utils.isMobile.any
        ? {
            resolution: window.devicePixelRatio || 1,
            autoResize: true
          }
        : {})
    }
    const app = new Application(options)
    ;(document.querySelector('#app') as HTMLElement).appendChild(app.view)
    app.ticker.add(() => {
      emitter.emit(Events.TICKER)
    })

    apps.pixi = app
  }

  const initEvents = () => {
    const onResize = (
      scale: number = resolution.scale,
      renderSize: Size = resolution.renderSize
    ): void => {
      const app = apps.pixi
      if (app) {
        app.renderer.resize(renderSize.width, renderSize.height)
        app.stage.scale.set(scale)

        const size = resolution.size

        store.commit('app/UPDATE_STATE', {
          adapter: {
            width: size.width,
            height: size.height,
            scale
          }
        })
      }
    }
    const onScreenStateChange = (
      state: ScreenState = resolution.state
    ): void => {
      store.commit('app/UPDATE_STATE', {
        adapter: {
          state
        }
      })
    }
    emitter
      .on(Events.RESIZE, onResize)
      .on(Events.STATE_CHANGE, onScreenStateChange)

    onResize()
    onScreenStateChange()
  }

  initVue()
  initPixi()
  initEvents()
  emitter.emit(Events.GAME_INIT)
  setTimeout(() => {
    //模拟数据请求
    //gameStart
    new Scence()
    emitter.emit(Events.GAME_ENTER)
  }, 200)
}
loader.load()
emitter.once(Events.LOAD_COMPLETE, () => {
  init()
})
