import { BitmapText, Container, Sprite } from 'pixi.js'
import { Events } from '@/const'
import { Resources } from '@/resources'
import { emitter, resolution } from '@/context'
import dayjs from 'dayjs'
export default class ParallaxScroller extends Container {
  constructor() {
    super()
    this.initParallaxScroller()
    emitter.on(Events.TICKER, () => {
      this.parent && this.ticker()
    })
    emitter.on(Events.STATE_CHANGE, () => {
      this.parent && this.onStateChange()
    })
  }

  private postition = 0
  private background: Sprite[] = []
  private foreground: Sprite[] = []
  private time!: BitmapText
  private initParallaxScroller(): void {
    Array.from({ length: 2 }).forEach(() => {
      const background = new Sprite(Resources.main.textures?.['bgtile.jpg'])
      background.scale.set(this.scaleValue)
      const foreground = new Sprite(Resources.main.textures?.['ground.png'])
      foreground.scale.set(this.scaleValue)
      foreground.anchor.set(0, 0.7)
      foreground.y = resolution.size.height
      this.background.push(background)
      this.foreground.push(foreground)

      this.addChild(...this.background, ...this.foreground)
    })
    this.setTime({
      text: dayjs().format('HH:mm:ss')
    })
  }

  private setParallaxScroller(
    sprites: Sprite[],
    postition: number = this.postition
  ) {
    const width = sprites[0].width
    const [first, clone] = sprites
    first.x = -postition
    first.x %= width * 2
    if (first.x < 0) {
      first.x += width * 2
    }
    first.x -= width
    clone.x = -postition + width
    clone.x %= width * 2
    if (clone.x < 0) {
      clone.x += width * 2
    }
    clone.x -= width
  }

  private setTime(newState: Partial<BitmapText> = {}) {
    if (!this.time) {
      this.time = new BitmapText('', {
        fontName: 'Desyrel',
        fontSize: 26,
        align: 'left'
      })
      this.time.x = 0
      this.time.y = 0
      this.addChild(this.time)
    }

    Object.assign(this.time, newState)
  }

  private ticker(): void {
    this.postition += 10
    this.setParallaxScroller(this.background, this.postition * 0.6)
    this.setParallaxScroller(this.foreground)
    this.setTime({
      text: dayjs().format('HH:mm:ss')
    })
  }

  private get scaleValue(): number {
    return resolution.size.height / 600
  }

  public onStateChange(): void {
    Array.from({ length: 2 }).forEach((item, i) => {
      this.background[i].scale.set(this.scaleValue)
      this.foreground[i].scale.set(this.scaleValue)
      this.foreground[i].y = resolution.size.height
    })
  }
}
