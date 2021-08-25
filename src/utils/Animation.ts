import EventEmitter from 'events'
export enum Ease {
  quadratic = 'quadratic',
  circular = 'circular',
  back = 'back',
  bounce = 'bounce',
  elastic = 'elastic'
}

export interface EaseItem {
  fn: (t: number) => number
}

export const easeMap: Record<Ease, EaseItem> = {
  [Ease.quadratic]: {
    fn: (t: number) => t * (2 - t)
  },
  [Ease.circular]: {
    fn: (t: number) => Math.sqrt(1 - --t * t)
  },
  [Ease.back]: {
    fn: (t: number) => {
      const b = 4
      return (t = t - 1) * t * ((b + 1) * t + b) + 1
    }
  },
  [Ease.bounce]: {
    fn: (t: number) => {
      if ((t /= 1) < 1 / 2.75) {
        return 7.5625 * t * t
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
      }
    }
  },
  [Ease.elastic]: {
    fn: (t: number) => {
      const f = 0.22,
        e = 0.4
      if (t === 0) {
        return 0
      }
      if (t == 1) {
        return 1
      }

      return (
        e * Math.pow(2, -10 * t) * Math.sin(((t - f / 4) * (2 * Math.PI)) / f) +
        1
      )
    }
  }
}

interface Target {
  [key: string]: number
}

export default class Animation extends EventEmitter {
  constructor(target: Target) {
    super()
    this.target = target
  }

  public isAnimating = false
  private target: Target | null | undefined = null

  private getNow(): number {
    return +new Date()
  }

  private setTarget(callback: (key: string) => number): void {
    for (const key in this.target) {
      if (Object.prototype.hasOwnProperty.call(this.target, key)) {
        this.target[key] = callback(key)
      }
    }

    this.emit('update', this.target)
  }

  public to(end: Target, duration: number, ease: Ease = Ease.circular): this {
    if (this.isAnimating) return this
    const startTime = this.getNow(),
      endTime = startTime + duration,
      start = JSON.parse(JSON.stringify(this.target))
    const raf =
      requestAnimationFrame ||
      requestAnimationFrame.bind(window) ||
      ((fn) => {
        setTimeout(fn, 1000 / 60)
      })

    const step = () => {
      const now = this.getNow()
      if (now < endTime) {
        const t = (now - startTime) / duration
        const easing = easeMap[ease].fn(t) //progress;
        this.setTarget((key) => (end[key] - start[key]) * easing + start[key])
        if (this.isAnimating) {
          raf(step)
        }
      } else {
        this.isAnimating = false
        this.setTarget((key) => end[key])
        this.emit('complete', this.target)
      }
    }
    this.isAnimating = true
    step()
    return this
  }

  public kill(): this {
    this.isAnimating = false
    return this
  }
}
