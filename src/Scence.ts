import { apps } from '@/context'
import ParallaxScroller from '@/components/ParallaxScroller'
export default class Scence {
  public parallaxScroller!: ParallaxScroller

  constructor() {
    this.init()
  }

  protected init(): void {
    this.initComponent()
  }

  protected initComponent(): void {
    this.parallaxScroller = new ParallaxScroller()

    apps.pixi?.stage.addChild(
      this.parallaxScroller
      // this.spineBoy,
      // this.fighter
    )
  }
}
