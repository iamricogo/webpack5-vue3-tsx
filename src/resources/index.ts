import Loading, { pixiLoader } from '@/loader/loading'
export type IResources = Record<string, Record<string, string | string[]>>
const resources: IResources = {
  sprites: {
    main: require('@/assets/images/sprites/main/_spritesmith/main.sprites.json'),
    nums: require('@/assets/images/sprites/nums/num.sprites.xml'),
    desyrel: require('@/assets/images/sprites/desyrel/desyrel.sprites.xml')
  },
  spines: {
    boy: require('@/assets/images/spines/boy/spineboy-pro.spine.json')
  }
}
const loader = new Loading()
const Resources = pixiLoader.resources
export { loader, Resources }
export default resources
