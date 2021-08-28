import { defineComponent } from 'vue'
import AppFooter from './components/appfooter'
import AppHeader from './components/appheader'
import AppMain from './components/appmain'
import style from './style.module.scss'
export default defineComponent({
  name: 'Layout',
  setup: () => {
    return () => (
      <div class={[style['app-wrapper']]}>
        <div class={[style['main-container']]}>
          <header class={[style['fixed-header']]}>
            <AppHeader />
          </header>
          <main>
            <AppMain />
          </main>
          <footer>
            <AppFooter />
          </footer>
        </div>
      </div>
    )
  }
})
