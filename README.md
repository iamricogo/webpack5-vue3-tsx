# 项目介绍

本项目用到的技术栈 tsnode + webpack5 + vue3 生态 + typescriptX + pixi.js 游戏引擎 + sass

项目搭建未用 vue-cli 等主流脚手架，用 webpack 原生手撸。css 预编译 sass 语法采用 dart sass,非 node sass, dart sass 已直接更名为 sass

pixi 游戏引擎生态中资源加载相关开发了自定义 webpack loader

# 在线预览

- 通过 [vercel](https://vercel.com/) 部署：

  [点击打开](https://webpack5-vue3-tsx.vercel.app/)

- 通过 [github actions](https://github.com/features/actions) 部署到 [github.io](https://pages.github.com/)：

  [点击打开](https://iamricogo.github.io/webpack5-vue3-tsx/)

# commit 规范

[husky](https://typicode.github.io/husky/#/) 是 git 一些行为的钩子依赖，高版本 首次需要显式 执行 npx husky install 以 开启 git 钩子

```json
  "scripts": {
    "prepare": "husky install",
  },
```

上述配置会在 npm i 或 yarn 执行时 自动执行 husky install

注意：Yarn 2 不支持 scripts 的 prepare 生命周期,需手动执行一次 .

```bash
npx husky install
```

开启 git hooks 后

会对提交时的消息体进行拦截，如果不符合规范会拦截该次提交行为，同时还会执行代码相关的 lint，能自动修复的就自动修复，不能修复的也会阻止提交并做出相应错误的提示

```
${action}: xxxx
xxxxxxxxxxx
```

例如

```
feat: 添加xxx页面
```

所有可用的 action 在 commitlint.config.js 中做配置

```js
;[
  'init' /**初次提交 */,

  'ci' /**CI持续集成修改 */,
  'test' /**增加测试 */,
  'build' /**更新打包文件 */,
  'release' /**发布/版本标签 */,

  'docs' /**撰写文档 */,
  'chore' /**其他修改, 比如改变构建流程、或者增加依赖库、工具等 */,
  'feat' /**引入新特性 */,
  'fix' /**修复 bug */,
  'perf' /**提升性能 */,
  'revert' /**代码回滚 */,
  'refactor' /**重构 */,
  'style' /**改进代码的结构格式/样式 */,
  'delete' /**删除代码或文件 */
]
```

# 项目脚本

本项目中维护的 yarn.lock 非 npm 的 package-lock.json 文件
而 lock 文件对依赖的小版本固定起到关键作用，建议团队统一包管理工具，运维部署时也使用对应的包管理器
本项目默认 yarn 做包管理工具

## 依赖安装

```bash
yarn # yarn 做包管理
npm i # npm 做包管理
```

## development 模式

```bash
yarn start
npm start
```

## production 模式

```bash
yarn build # yarn 执行脚本，省略 run 关键字

npm run build #传统构建，代码 es5 化，能兼容到 IE11，目前 jenkins 中用的是此种构建，更稳一点

npm run build:modern #现代化构建，es6 及更高版本 modules 规范，支持现代化高级浏览器，class 等语法均不会换成基于原型链的构造函数

npx cross-env report=true npm run build #传统构建，构建完成后启动依赖分析报告

npx cross-env report=true npm run build:modern #现代化构建，构建完成后启动依赖分析报告
```

# 技术点

- ## 熟悉 webpack 系列生态。

  - ### [webpack 配置如何用 typescript 写？](https://webpack.js.org/guides/typescript/)

  - ### webpack 项目资源加载相关

    #### webpack require 或者 import 一个资源发生了什么？

    - require / import 触发

      ```ts
      //按相对路径解析
      const module1 = require('./xxx')
      //按reslove.modules 配置路径进行解析，默认是 'node_modules'
      const module2 = require('xxx')
      //按reslove.alias 配置的别名进行解析
      const module3 = require('@/xxx')
      ```

    - loaderContext 加载器上下文上的[reslove](https://webpack.js.org/api/loaders/#thisresolve)方法来查询资源，返回真实路径

      ```ts
      this.resolve(context, request, (err, result) => {
        console.log(result)
      })
      ```

      context：是调用 require 函数的文件所在的路径
      request：require()函数中传入的路径
      result: 该资源在当前系统上的真实路径

    - 调用 webpack loader (css-loader,vue-loader 或自定 loader) 函数处理资源

      nodejs 文件系统根据上一步的真实的资源系统路径，读取文件内容，根据 module.rules 中的正则规则来调用指定的 webpack loader 集合

      webpack5 对于图片音视频等原先需要用 url-loader/file-loader 处理的资源 内置了 [Asset Modules](https://webpack.js.org/guides/asset-modules/#root) 进行处理

    - 总结：类比 Rxjs 响应式编程思想

    ```ts
    import { fromEvent } from 'rxjs'
    import { scan } from 'rxjs/operators'

    fromEvent(document, 'click') //此处为观察一个名叫click的行为事件，一旦用户发起点击行为，就会触发流程 ，webpack资源引用过程及为观察一个叫require/import函数的调用，一旦require被调用，就会触发流程
      .pipe(scan((count) => count + 1, 0)) //loader1
      .pipe() //loader2
      .subscribe({ next: (count) => console.log(`Clicked ${count} times`) }) //输出的结果即require 函数返回值
    ```

    #### 资源加载优化方案

    - ##### 主入口的优化

      ###### 传统入口的白屏问题分析：

      ```ts
      //main.js
      //UI框架库主体
      import Ant from '@/plugins/ant-design-vue'
      //响应式框架主体
      import { createApp } from 'vue'
      import App from '@/App'
      //国际化插件主体
      import i18n from '@/lang'
      //路由控制主体
      import router from '@/router'
      //状态管理主体
      import store, { key } from '@/store'

      const app = createApp(App)
      app.use(Ant).use(i18n).use(router).use(store, key).mount('#app')
      ```

      上面的代码中列出了我们入口一般常见的一些需要引入的依赖，
      只有最后一句执行时，#app dom 元素上才会被挂载出 dom 对象显示页面内容，而最后一句的执行依赖上面所有引入的一些依赖要加载完毕
      这个加载过程就是所谓的白屏问题

      ###### 解决方案：提前渲染提示 UI，同时动态加载依赖脚本

      - 首先将原来 main.js 更名为 main.async.js

      - 新建 main.js

        ```ts
        //main.js
        const { LoaderUI } = await import('@/loader/ui')
        new LoaderUI().load()
        //main.js
        import('@/main.async')
        ```

      - 抽离一个 Loader 组件，里面的依赖要尽可能少，比如用原生 js 操作 dom 创建一个 loading UI 界面。
        或者借助一些比较小的用作 loading 过程的库 如 nprogress

        ```ts
        //main.js
        import NProgress from 'nprogress'
        NProgress.configure({ showSpinner: false }) // NProgress Configuration
        ;(async () => {
          NProgress.start()
          await import('@/main.async')
          NProgress.done()
        })()
        ```

    - ##### 精灵图方案及自定义 loader 配合

      ###### 基础依赖： [ webpack-spritesmith ](https://www.npmjs.com/package/webpack-spritesmith)

      - 核心流程

        1. 配置精灵图的路径（源）
        2. 配置合图及合图描述文件（包含散精灵图在合图中的位置信息等，有 json/scss/less/styl 等媒介）的输出路径
        3. 按配置自动生成合图及合图描述文件
        4. 业务中引用合图资源，同时根据合图描述文件里的信息定位信息取出精灵位置

      - scss/less/styl 中调用

        ```scss
        //该文件为上面自动合图scss描述文件,包含精灵图变量，一些 @mixin 等
        @use "@/assets/images/sprites/main/_spritesmith/main.scss" as *;
        //该文件为项目公用的一些 @mixin 里面添加了支持合图缩放的 @mixin
        @use "@/styles/_mixins.scss" as *;

        .logo {
          display: inline-block;
          //调用自动生成的 @mixin sprite
          @include sprite($sprite-main-logo);
          //调用支持按指定宽高缩放的 @mixin sprite-size
          //@include sprite-size($sprite-main-logo, 10px, 10px);
          //调用支持按指定缩放比例缩放的 @mixin sprite-scale
          //@include sprite-scale($sprite-main-logo, 0.5, , 0.4);
        }
        ```

        上面的代码中的两个@use 可以优化成自动注入，因为@mixin 只会存在内存中，变成 css 文件后这些函数是不会以文本形式存在的

        @mixins sprite 执行后的代码

        ```scss
        .logo {
          display: inline-block;
          //调用自动生成的 @mixin sprite
          width: 40px;
          height: 40px;
          background-image: url('~@/assets/images/sprites/main/_spritesmith/main.png');
          background-position: 0 -164.2px;
          background-size: 257.2px 204.2px;
        }
        ```

        scss/less/styl 等资源会最终会经过 css-loader,css-loader 会把 url 代码判断解析 替换成 require 函数引入的效果，最终拿到 base64 字符串或者输出到 dist 目录的资源路径

        ```js
        require('@/assets/images/sprites/main/_spritesmith/main.png') //http://localhost:8080/assets/main.e6ede0e4500ce45cfc2a.png
        ```

      - js 中调用
        想在 js 中调用，生成.json 格式的合图描述文件是更灵活的

        ```ts
        //资源下载工具
        import { loadImage, loadJson } from '@/utils/Loader'
        //路径计算工具
        import { pathFormat } from '@/utils/FormatterUtils'
        //引入json合图信息，注意main.sprites.json未走常规json文件的loader，常规的json引入后直接是对象,这里跟import 一个 png 资源一样，会将原文件emit到dist中，并返回输出的路径
        import spritesJson from '@/assets/images/sprites/main/_spritesmith/main.sprites.json' //http://localhost:xxx/assets/../assets/main.sprites.3562fec29aada1b7ca9f.json

        loadJson(spritesJson as unknown as string).then((res) => {
          const basePath = spritesJson as unknown as string

          if (typeof res.meta == 'object') {
            {
              const imagePath = pathFormat(
                (res.meta as Record<string, string>).image,
                basePath
              )

              loadImage(imagePath).then((img) => {
                if (img instanceof HTMLElement) {
                  document.body.appendChild(img)
                }
              })
            }
          }
        })
        ```

        因 webpack.config 中定义了满足/\.sprites\.(text|json|(ht|x)ml)(\?.\*)?$/特征的资源的处理模式，所以上面的 json 文件返回效果和常规的会有差异

        ```ts

        {
          test: /\.sprites\.(text|json|(ht|x)ml)(\?.*)?$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'sprites-loader',
              options: {
                esModule: false
              }
            }
          ]
        },
        ```

      ###### 自定义 webpack loader 配合：

      sprites-loader 用于加载一个记录了合图及各精灵图信息的资源，可以是 json、xml、html 等任意文本资源

      流程分析：

      - require / import 函数触发正则匹配的资源

        ```ts
        const spritesJson = require('@/assets/images/sprites/main/_spritesmith/main.sprites.json')
        //import spritesJson from '@/assets/images/sprites/main/_spritesmith/main.sprites.json'
        ```

      - 进入 sprites-loader 函数

        需求分析：

        读取被 require 的资源文本内容 =>

        正则匹配文本内容中的子依赖资源路径 =>

        nodejs 根据匹配的路径读取子依赖文件内容 =>

        子依赖文件内容传入 file-loader emit 到 dist 目录 并拿到输出路径 =>

        替换文本内容的子依赖路径为上一步输出的路径 =>

        新的文本内容传入 file-loader emit 到 dist 目录

        代码实现：（代码可能较旧，具体以 build/lib/loader/sprites-loader.ts 为准）

        ```js
        const loaderUtils = require('loader-utils')
        const path = require('path')
        const utils = require('./utils')
        module.exports = async function (content, options = {}) {
          //...
          //定义需要匹配进行替换的正则
          const imgReg = /(\w|-|~|@|\/)+\.(png|jpe?g)/g

          //原始content进行异步替换
          const newContent = await utils.replaceAsync(
            content,
            imgReg,
            async (match) => {
              const request = loaderUtils.urlToRequest(match)
              const realPath = await utils.resolve(this, request)
              //匹配成功且资源存在
              if (realPath) {
                //建立依赖关系，即该图片资源发生变化时，loader会重新执行一遍
                this.addDependency(realPath)
                //...
                //获取匹配的图片输出路径
                const imgEmitName = utils.getEmitName(...args)
                //输出匹配出来的图片资源
                utils.fileLoader(...args)
                //根据图片的输出路径和原始资源输出路径计算出相对路径并将原内容进行替换
                return path.posix.relative(contentEmitDir, imgEmitName)
              }
              //匹配的资源如果不存在直接不替换了
              return match
            }
          )
          //输出替换过内容的资源
          return utils.fileLoader(this, newContent, options)
        }
        ```

- ## typescript & vue3 ts 生态

  - ### [vue3 typescript 官网文档](https://v3.cn.vuejs.org/guide/typescript-support.html#npm-%E5%8C%85%E4%B8%AD%E7%9A%84%E5%AE%98%E6%96%B9%E5%A3%B0%E6%98%8E)

  - ### [vue-types vue props 类型定义校验工具，vue3 启用 ts 时建议使用](https://www.npmjs.com/package/vue-types)

  - ### 状态管理方案

    #### vuex

    [vuex ts](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#typescript-support)

    官方推荐方案，但在 ts 生态下，通过 commit ,dispatch 等调用 mutations 和 actions 时 无法做类型校验

    [vuex-module-decorators](https://www.npmjs.com/package/vuex-module-decorators)

    三方库，暂未支持 vue3，vuex 变成了 Class 配合修饰器的写法

    #### 通过 provide/inject api 自行管理 （推荐）

    - 以 hooks 方式定义状态管理 (支持持久化)

      ```ts
      //@/store/hooks/index.ts
      import { inject, reactive, watch } from 'vue'
      import { merge } from 'lodash'
      import PersistedState from '@/utils/PersistedState'
      interface State {
        count: number
        deep: {
          persisted: number
          normal: number
        }
        deep2: {
          persisted: number
          normal: number
        }
      }

      export const key = Symbol()

      export interface Store {
        state: State
        getters: {
          doubleCount: number
        }
        mutations: {
          updateState: (newState: DeepPartial<State>) => void
        }
      }

      export const useCreateStore = (): { store: Store; key: typeof key } => {
        const store: Store = {
          state: reactive<State>({
            count: 0,
            deep: {
              persisted: 0,
              normal: 0
            },
            deep2: {
              persisted: 0,
              normal: 0
            }
          }),
          mutations: {
            updateState: (newState: DeepPartial<State> = {}) => {
              console.warn(newState)
              merge(store.state, newState)
            }
          },
          get getters() {
            const state = store.state
            return {
              get doubleCount(): number {
                return state.count * 2
              }
            }
          }
        }

        const persistedState = new PersistedState<State>({
          state: store.state,
          reducer: ({ count, deep: { persisted } }) => ({
            count,
            deep: { persisted }
          })
        })

        watch(store.state, () => {
          persistedState.update()
        })

        return {
          store,
          key
        }
      }

      export const useStore = (): Store =>
        inject<Store>(key) as NonNullable<Store>
      ```

    - 调用 inject 在根组件进行注入

      方案一：直接通过 provide 注入 ，使用 readonly 包裹 store 避免修改

      ```tsx
      //@/App.tsx
      import { defineComponent, provide, readonly } from 'vue'
      import { useCreateStore } from '@/store/hooks'
      import Adapter from '@/components/Adapter'
      import Provider from '@/components/Provider'
      export default defineComponent({
        name: 'App',
        setup: () => {
          const { store, key } = useCreateStore()
          provide(key, readonly(store))
          return () => <router-view />
        }
      })
      ```

      方案二：调用抽象组件 Provider 在根组件进行注入（推荐）

      ```tsx
      //@/App.tsx
      import { defineComponent } from 'vue'
      import { useCreateStore } from '@/store/hooks'
      import Provider from '@/components/Provider'
      export default defineComponent({
        name: 'App',
        setup: () => {
          const { store, key } = useCreateStore()
          return () => (
            <Provider store={store} storeKey={key}>
              <router-view />
            </Provider>
          )
        }
      })
      ```

      通过 Provider 组件，可以在 template 语法中任意节点处注入一些公用的状态

      ```tsx
      //@/components/Provider
      import { defineComponent, provide, readonly } from 'vue'
      import AppTypes, { oneOfType } from '@/vue-types'
      const iProviderProps = {
        storeKey: oneOfType([String, Number, Symbol]).isRequired,
        store: AppTypes.object.isRequired
      }

      export default defineComponent({
        name: 'Provider',
        props: iProviderProps,
        setup: (props, { slots }) => {
          provide(props.storeKey, readonly(props.store))
          return () => slots?.default?.()
        }
      })
      ```

    - 业务组件中使用状态及改变状态

      tsx 组件调用

    ```tsx
    import { debounce } from 'lodash'
    import { defineComponent, reactive, ref } from 'vue'
    import { numberFormat } from '@/utils/FormatterUtils'
    import { useStore } from '@/store/hooks'
    import Animation, { Ease } from '@/utils/Animation'
    import Button from '@/components/Button'

    export default defineComponent({
      name: 'Home',
      setup: () => {
        const {
          state,
          getters,
          mutations: { updateState }
        } = useStore()

        let logoAnimation!: Animation
        const onButtonTap = debounce(() => {
          if (logoAnimation?.isAnimating) return
          const start = state.count,
            duration = 1000 * 10
          logoAnimation = new Animation({ count: start })
            .to({ count: state.count + 1000 * 10 }, duration, Ease.bounce)
            .on('update', ({ count }, progress) => {
              updateState({ count })
              console.log(getters.doubleCount)
            })
            .on('complete', () => {
              console.log('complete')
            })
        }, 300)

        return () => (
          <div class={[style.home]}>
            <div>
              <Button label={numberFormat(state.count)} onTap={onButtonTap} />
            </div>
          </div>
        )
      }
    })
    ```

    .vue 单模板组件中调用 store

    ```html
    <template>
      <div>
        <tag>others</tag>

        <p>state.deep.persisted:{{ store.state.deep.persisted }}</p>
        <p>state.deep.normal:{{ store.state.deep.normal }}</p>

        <button @click="plus">+</button>
        <button @click="minus">-</button>
      </div>
    </template>
    <script lang="ts">
      import { Tag } from 'ant-design-vue'
      import { defineComponent } from 'vue'
      import { useStore } from '@/store/hooks'

      export default defineComponent({
        name: 'Others',
        components: {
          Tag
        },
        setup: () => {
          const store = useStore()
          return { store }
        },
        methods: {
          plus() {
            const {
              state: {
                deep: { persisted, normal }
              }
            } = this.store
            this.store.mutations.updateState({
              deep: { persisted: persisted + 1, normal: normal + 1 }
            })
          },
          minus() {
            const {
              state: {
                deep: { persisted, normal }
              }
            } = this.store
            this.store.mutations.updateState({
              deep: { persisted: persisted - 1, normal: normal - 1 }
            })
          }
        }
      })
    </script>
    ```

- ## vue3 tsx 生态

  - ### [vue3 jsx 官网文档](https://v3.cn.vuejs.org/guide/render-function.html#jsx)

  - ### [@vue/babel-plugin-jsx,不用显式安装，已集成到@vue/babel-preset-app，可参内部 demo 语法](https://github.com/vuejs/jsx-next)

- ## tsx 和 jsx 的差异

  tsx 的 render 函数中引入组件和 jsx 还是有一定的差异。jsx 中原本只需要 import 后 直接 在 render 函数里面使用即可，在 tsx 中如果用大写开头当变量，render 函数中会进行（props，events，slots）类型校验

  ```tsx
  import LangSelect from '@/components/langselect'
  export default {
    render() {
      return <LangSelect />
    }
  }
  ```

  ```tsx
  /**
   * 利用components进行组件局部注册，render函数中用小写及-拼接
   */
  import LangSelect from '@/components/langselect'

  export default {
    components: {
      LangSelect
    },
    render() {
      return <lang-select />
    }
  }

  /**
   * 直接用小写开头的变量进行import
   */
  import langSelect from '@/components/langselect'
  export default {
    render() {
      return <langSelect />
    }
  }
  ```

- ## sass 语法 及 css 冲突另一种解决方案 css modules 方案

  ```scss
  //./style.module.scss
  @mixin sprite-scale($sprite, $scaleX: 1, $scaleY: $scaleX) {
    width: nth($sprite, 5) * $scaleX;
    height: nth($sprite, 6) * $scaleY;
    background-image: url(nth($sprite, 9));
    background-position: nth($sprite, 3) * $scaleX nth($sprite, 4) * $scaleY;
    background-size: nth($sprite, 7) * $scaleX nth($sprite, 8) * $scaleY;
  }
  .abc {
    .cde {
      color: red;
    }
  }
  ```

  css modules

  ```tsx
  import style from './style.module.scss'

  export default {
    render() {
      return (
        <div class={[style.abc]}>
          <div class={[style.cde]}>123</div>
        </div>
      )
    }
  }
  ```
