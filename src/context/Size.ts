export default class Size {
  public width: number
  public height: number
  constructor(width = 0, height = 0) {
    this.width = width
    this.height = height
  }

  public get center(): {
    x: number
    y: number
  } {
    return {
      x: this.width / 2,
      y: this.height / 2
    }
  }

  public get ratio(): number {
    return this.width / this.height
  }
}
