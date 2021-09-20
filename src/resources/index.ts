import Loading, { pixiLoader } from '@/loader/loading'
export type IResources = Record<string, Record<string, string | string[]>>
const resources: IResources = {
  sprites: {
    main: require('@/assets/images/sprites/main/_spritesmith/main.sprites.json')
  }
}

const loader = new Loading()
const Resources = pixiLoader.resources
export { loader, Resources }

export default resources
