import { Events } from '@/const'
import { Loader } from 'pixi.js'
import { emitter } from '@/context'
import resources, { IResources } from '@/resources'
export const pixiLoader = new Loader()

export default class Loading {
  public async load(): Promise<void> {
    await this.loadJson()
    await this.loadFonts()
    await this.loadImages()
    emitter.once(Events.GAME_INIT, () => this.loadSounds())
  }

  protected loadImages(): void {
    this.loadResource(resources)
  }

  protected loadJson(): void {
    console.log('loadJson')
  }

  protected loadFonts(): void {
    console.log('loadFonts')
  }

  protected loadSounds(): void {
    console.log('loadSounds')
  }

  private loadResource(res: IResources): void {
    const interator = (
      res: IResources,
      cb: (key: string, path: string) => void
    ) => {
      for (const k in res) {
        const item: IResources[keyof IResources] = res[k]

        if (item instanceof Array) {
          ;(item as Array<string>).forEach((path, i) => {
            cb(k + '_' + i, path)
          })
        } else if (typeof item === 'object') {
          for (const key in item) {
            cb(key, item[key] as string)
          }
        } else if (typeof item === 'string') {
          cb(k, item as string)
        }
      }
    }
    const resources = pixiLoader.resources
    interator(res, (key: string, path: string) => {
      if (!resources[key]) pixiLoader.add(key, path)
    })

    pixiLoader
      .load(() => {
        emitter.emit(Events.LOAD_COMPLETE, pixiLoader.resources, res)
      })
      .onProgress.add(() =>
        emitter.emit(Events.LOAD_PROGRESS, pixiLoader.progress)
      )
  }
}
