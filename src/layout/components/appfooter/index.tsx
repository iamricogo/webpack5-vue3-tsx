import { defineComponent } from 'vue'
import style from './style.module.scss'
export default defineComponent({
  name: 'AppFooter',
  setup: () => {
    return () => <div class={style['app-footer']}>我是尾部</div>
  }
})
