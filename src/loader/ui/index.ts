import './style.scss'
import { Events } from '@/const'
import { device, emitter, resolution } from '@/context'

export class LoaderUI {
  private el!: HTMLElement
  private elContainer!: HTMLElement
  private elProgress!: HTMLElement
  private elText!: HTMLElement
  private elMask!: HTMLElement

  private init(): void {
    const browser = (() => {
      for (const key in device.browser) {
        if ((device.browser as Record<string, boolean>)[key]) {
          return key
        }
        return ''
      }
    })() as string
    document.body.setAttribute('data-browser', browser)
    this.el = document.createElement('div')
    this.el.setAttribute('class', 'loader-page')
    this.el.innerHTML = `
        <div class="container">
            <i class="logo"></i>
            <div class="progress">
                <span class="bar"></span>
            </div>
            <i class="message">Loading...</i>
        </div>
        <div class="mask"></div>
`
    document.body.appendChild(this.el)

    this.elContainer = document.querySelector(
      '.loader-page .container'
    ) as HTMLElement
    this.elProgress = document.querySelector('.loader-page .bar') as HTMLElement
    this.elText = document.querySelector('.loader-page .message') as HTMLElement
    this.elMask = document.querySelector('.loader-page .mask') as HTMLElement
    this.resize()
  }

  public load(): void {
    this.init()
    this.bindEvents()
  }

  private bindEvents(): void {
    const onResize = () => this.resize()
    const onProgress = (per: number) => (this.progress = per)
    const onText = (txt: string) => (this.text = txt)
    const onError = (err: string) => (this.text = err)

    emitter
      .on(Events.RESIZE, onResize)
      .on(Events.LOAD_PROGRESS, onProgress)
      .on(Events.LOAD_TEXT, onText)
      .on(Events.LOAD_ERROR, onError)
      .once(Events.GAME_ENTER, () => {
        emitter
          .off(Events.RESIZE, onResize)
          .off(Events.LOAD_PROGRESS, onProgress)
          .off(Events.LOAD_TEXT, onText)
          .off(Events.LOAD_ERROR, onError)
        this.complete()
      })
    window.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  private set progress(value: number) {
    this.elProgress.style.width = value + '%'
  }

  private set text(value: string) {
    this.elText.innerText = value
  }

  private resize(): void {
    this.elContainer.style.transform =
      'translate(-50%,-50%) scale(' + resolution.scale + ')'
    this.elContainer.style.width = `${100 / resolution.scale}% `
    this.elContainer.style.height = `${100 / resolution.scale}% `
  }

  private complete(): void {
    this.progress = 100
    this.elMask.style.opacity = '1'
    this.elMask.addEventListener('transitionend', () => {
      this.el.style.opacity = '0'
      this.el.addEventListener('transitionend', () => {
        document.body.removeChild(this.el)
      })
    })
  }
}
