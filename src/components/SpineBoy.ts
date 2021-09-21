import { Events, ScreenState } from '@/const'
import { Filter, Point } from 'pixi.js'
import { ISkeletonData, Spine } from 'pixi-spine'
import { apps, emitter, resolution } from '@/context'
import KeyBoard from '@/utils/KeyBoard'

enum spineBoyAnimation {
  AIM = 'aim',
  DEATH = 'death',
  JUMP = 'jump',
  PORTAL = 'portal',
  HOVERBOARD = 'hoverboard',
  SHOOT = 'shoot',
  WALK = 'walk',
  RUN = 'run',
  IDLE = 'idle'
}

export default class SpineBoy extends Spine {
  constructor(spineData: ISkeletonData) {
    super(spineData)

    this.initSpineBoy()
    this.initKeyBoard()
    emitter.on(Events.TICKER, () => {
      this.parent && this.ticker()
    })
    emitter.on(
      Events.STATE_CHANGE,
      (state: ScreenState, oldState: ScreenState) => {
        this.parent && this.onStateChange(state, oldState)
      }
    )
  }

  private keyBoardList: { [key: string]: KeyBoard } = {}
  private vx = 0
  private vy = 0
  private speed = 5
  private speedEffect = 2
  private shadowFilter!: Filter
  private get scaleValue(): number {
    return resolution.size.height / 600
  }

  private initSpineBoy(): void {
    this.scale.set(0.3)
    this.position.set(
      resolution.size.width / 2,
      resolution.size.height - 75 * this.scaleValue
    )
    this.interactive = true
    this.buttonMode = true
    this.shadowFilter = new Filter(
      `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        
        uniform mat3 projectionMatrix;
        
        varying vec2 vTextureCoord;
        
        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }
        `,
      `
        varying vec2 vTextureCoord;
        
        uniform sampler2D uSampler;
        uniform vec4 inputSize;
        uniform vec4 outputFrame;
        uniform vec2 shadowDirection;
        uniform float floorY;
        
        void main(void) {
            //1. get the screen coordinate
            vec2 screenCoord = vTextureCoord * inputSize.xy + outputFrame.xy;
            //2. calculate Y shift of our dimension vector
            vec2 shadow;
            //shadow coordinate system is a bit skewed, but it has to be the same for screenCoord.y = floorY
            float paramY = (screenCoord.y - floorY) / shadowDirection.y;
            shadow.y = paramY + floorY;
            shadow.x = screenCoord.x + paramY * shadowDirection.x;
            vec2 bodyFilterCoord = (shadow - outputFrame.xy) * inputSize.zw; // same as / inputSize.xy
        
            vec4 originalColor = texture2D(uSampler, vTextureCoord);
            vec4 shadowColor = texture2D(uSampler, bodyFilterCoord);
            shadowColor.rgb = vec3(0.0);
            shadowColor.a *= 0.5;
        
            // normal blend mode coefficients (1, 1-src_alpha)
            // shadow is destination (backdrop), original is source
            gl_FragColor = originalColor + shadowColor * (1.0 - originalColor.a);
        }
        `
    )
    this.shadowFilter.uniforms.shadowDirection = [0.4, 0.5]
    this.shadowFilter.uniforms.floorY = 0.0
    this.shadowFilter.padding = 100
    this.filters = [this.shadowFilter]
    this.stateData.setMix(spineBoyAnimation.PORTAL, spineBoyAnimation.WALK, 0.2)
    this.stateData.setMix(spineBoyAnimation.JUMP, spineBoyAnimation.WALK, 0.4)
    this.stateData.setMix(spineBoyAnimation.JUMP, spineBoyAnimation.RUN, 0.4)
    this.stateData.setMix(spineBoyAnimation.WALK, spineBoyAnimation.JUMP, 0.4)
    this.stateData.setMix(spineBoyAnimation.RUN, spineBoyAnimation.JUMP, 0.4)
    this.doAnimation(spineBoyAnimation.PORTAL, [spineBoyAnimation.WALK])
    if (apps.pixi) {
      apps.pixi.stage.interactive = true
      apps.pixi.stage.on('pointerdown', () => {
        this.doAnimation(spineBoyAnimation.JUMP, [spineBoyAnimation.RUN])
      })
    }
  }

  private doAnimation(
    animation: spineBoyAnimation,
    nextAnimation?: spineBoyAnimation[]
  ): void {
    const loopAnimations = ['hoverboard', 'idle', 'run', 'shoot', 'walk']
    const oldAnimation = this.state.tracks[0]
      ? this.state.tracks[0].animation.name
      : ''
    if (animation == oldAnimation) return
    this.state.setAnimation(0, animation, loopAnimations.includes(animation))
    nextAnimation &&
      nextAnimation.forEach((animation: spineBoyAnimation) => {
        this.state.addAnimation(
          0,
          animation,
          loopAnimations.includes(animation),
          0
        )
      })
  }

  private initKeyBoard(remove?: boolean): void {
    if (remove) {
      for (const key in this.keyBoardList) {
        this.keyBoardList[key] && this.keyBoardList[key].destroy()
      }
      this.keyBoardList == {}
      return
    }

    const doSpeedEffect = () => {
      if (this.keyBoardList.shift.isDown) {
        this.vx *= this.speedEffect
        this.vy *= this.speedEffect
        this.doAnimation(spineBoyAnimation.RUN)
      } else {
        this.vx /= this.speedEffect
        this.vy /= this.speedEffect
        this.doAnimation(spineBoyAnimation.WALK)
      }
    }

    this.keyBoardList.left = new KeyBoard(
      [37, 65],
      () => {
        this.vx = -1 * this.speed
        doSpeedEffect()
      },
      () => {
        this.vx = 0
      }
    )

    this.keyBoardList.right = new KeyBoard(
      [39, 68],
      () => {
        this.vx = 1 * this.speed
        doSpeedEffect()
      },
      () => {
        this.vx = 0
      }
    )

    this.keyBoardList.shift = new KeyBoard(16, doSpeedEffect, doSpeedEffect)

    this.keyBoardList.space = new KeyBoard(32, () => {
      this.doAnimation(spineBoyAnimation.JUMP, [spineBoyAnimation.RUN])
    })
  }

  private containCheck(): void {
    if (this.x < this.width / 2) this.x = this.width / 2
    if (this.x > resolution.size.width - this.width / 2)
      this.x = resolution.size.width - this.width / 2
  }

  private ticker(): void {
    this.x += this.vx
    this.y += this.vy
    this.shadowFilter.uniforms.floorY = this.toGlobal(new Point(0, 0)).y
    this.containCheck()
  }

  public onStateChange(state: ScreenState, oldState: ScreenState): void {
    if (
      !oldState ||
      (state == ScreenState.LANDSCAPE && oldState == ScreenState.WEB) ||
      (state == ScreenState.WEB && oldState == ScreenState.LANDSCAPE)
    )
      return

    this.position.set(
      this.x * resolution.size.ratio,
      resolution.size.height - 75 * this.scaleValue
    )
  }
}
