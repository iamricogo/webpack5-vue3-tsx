import { parse, relative, resolve } from 'path'
import SpritesmithPlugin from 'webpack-spritesmith'

type Config = {
  input: string
}
const list: Config[] = [
  {
    input: `assets/images/sprites/main`
  }
]

export default [
  ...list.map(({ input }) => {
    const namespace = input.split('/').pop()
    const target = `_spritesmith`
    const output = `${input}/${target}`
    const assetsPath = resolve(__dirname, `../../src/${input}`)
    const outputPath = resolve(__dirname, `../../src/${output}`)
    const cssImageRef = `~@/${output}/${namespace}.png`
    return new SpritesmithPlugin({
      spritesmithOptions: {
        padding: 1
      },
      src: {
        cwd: assetsPath,
        glob: ['*.png', '*.jpg']
      },
      target: {
        image: `${outputPath}/${namespace}.png`,
        css: [
          [`${outputPath}/${namespace}.scss`],
          [
            `${outputPath}/${namespace}.sprites.json`,
            {
              format: 'json_texture'
            }
          ]
        ]
      },

      apiOptions: {
        cssImageRef,
        spritesheet_info: {
          name: namespace + '-spritesheet'
        },
        generateSpriteName: (fileName) =>
          `sprite_${namespace}_${parse(relative(assetsPath, fileName)).name}`
      }
    })
  })
]
