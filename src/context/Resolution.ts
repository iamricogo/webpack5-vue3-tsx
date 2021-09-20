import { Events, ScreenState } from '@/const'
import { device, emitter } from './'
import Size from './Size'

interface IConfig {
  size: ISize
}

interface ISize {
  width: number
  height: number
}

export const config: IConfig = {
  size: {
    width: 800,
    height: 600
  }
}

export class Resolution {
  public size: Size // 游戏尺寸
  public scale = 1 //缩放比例
  public state!: ScreenState
  public renderSize!: Size // 游戏实际渲染大小

  constructor() {
    const size = config.size
    this.size = new Size(size.width, size.height)
    window.addEventListener('resize', () => this.onResize())
    window.addEventListener('orientationchange', () => this.onResize())
    emitter.once(Events.GAME_ENTER, () => {
      this.onResize()
      emitter.emit(Events.STATE_CHANGE, this.state)
    })

    this.onResize()
  }

  private onResize(): void {
    this.doState()
    this.doResize()
  }

  private doState(): void {
    const toState = device.screenState
    if (toState === this.state) return

    const oldState = this.state
    this.state = toState

    this.size = this.isPortrait
      ? new Size(config.size.height, config.size.width)
      : new Size(config.size.width, config.size.height)
    document.body.setAttribute('data-screen', this.state)
    emitter.emit(Events.STATE_CHANGE, this.state, oldState)
  }

  private doResize(): void {
    const winSize = new Size(innerWidth, innerHeight)
    const size = this.size
    const scale =
      winSize.ratio > size.ratio
        ? winSize.height / size.height
        : winSize.width / size.width
    const renderSize = new Size(size.width * scale, size.height * scale)
    this.scale = scale
    this.renderSize = renderSize
    emitter.emit(Events.RESIZE, scale, this.renderSize)
  }

  public get isPortrait(): boolean {
    return this.state === ScreenState.PORTRAIT
  }

  public get isLandscape(): boolean {
    return this.state === ScreenState.LANDSCAPE
  }
}
