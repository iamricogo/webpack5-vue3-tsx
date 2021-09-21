export default class KeyBoard {
  constructor(
    keyCode: number | number[],
    press: () => void,
    release?: () => void
  ) {
    this.keyCodes = typeof keyCode == 'number' ? [keyCode] : keyCode
    this.press = press
    if (release) this.release = release

    this.initEvents()
  }
  public isDown = false
  private keyCodes: number[]
  private press: () => void
  private release!: () => void

  private initEvents(remove?: boolean): void {
    const eventType = remove
        ? (el: Window, ...reset: Parameters<typeof removeEventListener>) => {
            el.removeEventListener(...reset)
          }
        : (el: Window, ...reset: Parameters<typeof addEventListener>) => {
            el.addEventListener(...reset)
          },
      target = window,
      handleEvent = {
        handleEvent: this.handleEvent.bind(this)
      }

    eventType(target, 'keydown', handleEvent)
    eventType(target, 'keyup', handleEvent)
  }

  private getKeyCode(e: KeyboardEvent): number {
    return Number(e.key) || e.keyCode
  }

  private onKeyDown(e: KeyboardEvent): void {
    const key = this.getKeyCode(e)
    if (this.isDown) return
    if (this.keyCodes.includes(key)) {
      this.isDown = !this.isDown
      this.isDown && this.press && this.press()
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (!this.isDown) return
    const key = this.getKeyCode(e)

    if (this.keyCodes.includes(key)) {
      this.isDown = !this.isDown
      !this.isDown && this.release && this.release()
    }
  }

  protected handleEvent(e: KeyboardEvent): void {
    switch (e.type) {
      case 'keydown':
        this.onKeyDown(e)
        break
      case 'keyup':
        this.onKeyUp(e)
        break
    }
  }

  public destroy(): void {
    this.initEvents(true)
  }
}
