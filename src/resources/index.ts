import Loading, { pixiLoader } from '@/loader/loading'

export type IResources = Record<string, Record<string, string | string[]>>
const resources: IResources = {
  test: require('@/assets/images/sprites/main/_spritesmith/main.png'),
  sprites: {
    main: require('@/assets/images/sprites/main/_spritesmith/main.sprites.json'),
    desyrel: require('@/assets/images/sprites/desyrel/desyrel.sprites.html')
  },
  spines: {
    boy: require('@/assets/images/spines/boy/spineboy-pro.spine.json')
  }
}

const loader = new Loading()
const Resources = pixiLoader.resources
export { loader, Resources }
export default resources
