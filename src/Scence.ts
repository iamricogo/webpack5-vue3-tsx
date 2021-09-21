import { Resources } from '@/resources'
import { apps } from '@/context'
import ParallaxScroller from '@/components/ParallaxScroller'
import SpineBoy from '@/components/SpineBoy'
export default class Scence {
  public parallaxScroller!: ParallaxScroller
  public spineBoy!: SpineBoy
  constructor() {
    this.init()
  }

  protected init(): void {
    this.initComponent()
  }

  protected initComponent(): void {
    this.parallaxScroller = new ParallaxScroller()
    if (Resources.boy.spineData) {
      this.spineBoy = new SpineBoy(Resources.boy.spineData)
    }

    apps.pixi?.stage.addChild(
      this.parallaxScroller,
      this.spineBoy
      // this.fighter
    )
  }
}
