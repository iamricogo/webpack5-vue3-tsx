module.exports = {
  presets: [
    [
      '@vue/babel-preset-app',
      {
        corejs: {
          version: 3, // 使用core-js@3
          proposals: true
        }
      }
    ],
    [
      '@babel/preset-typescript', // 引用Typescript插件
      {
        isTSX: true,
        allExtensions: true // 支持所有文件扩展名，否则在vue文件中使用ts会报错
      }
    ]
  ],
  plugins: [
    ...[
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        customStyleName: (name) => {
          return `ant-design-vue/es/${name}/style/index`
        }
      },
      {
        libraryName: 'element-plus',
        libraryDirectory: 'es',
        customStyleName: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`
        }
      },
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        customStyleName: (name) => {
          return `vant/es/${name}/style`
        }
      },
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false // default: true
      }
    ].map((options) => ['import', options, options.libraryName])
  ]
}
