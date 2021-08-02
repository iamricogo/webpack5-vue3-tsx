# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur). Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

### If Using `<script setup>`

[`<script setup>`](https://github.com/vuejs/rfcs/pull/227) is a feature that is currently in RFC stage. To get proper IDE support for the syntax, use [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) instead of Vetur (and disable Vetur).

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can use the following:

### If Using Volar

Run `Volar: Switch TS Plugin on/off` from VSCode command palette.

### If Using Vetur

1. Install and add `@vuedx/typescript-plugin-vue` to the [plugins section](https://www.typescriptlang.org/tsconfig#plugins) in `tsconfig.json`
2. Delete `src/shims-vue.d.ts` as it is no longer needed to provide module info to Typescript
3. Open `src/main.ts` in VSCode
4. Open the VSCode command palette
5. Search and run "Select TypeScript version" -> "Use workspace version"

```js
module.exports = {
  ciType: [
    {
      type: 'list',
      name: 'type',
      message: '请选择本次提交的类型:',
      choices: [
        {
          name: '引入新特性',
          value: 'feat'
        },
        {
          name: '改进代码的结构格式/样式',
          value: 'style'
        },
        {
          name: '修复 bug',
          value: 'fix'
        },
        {
          name: '提升性能',
          value: 'perf'
        },
        {
          name: '删除代码或文件',
          value: 'delete'
        },
        {
          name: '其他修改, 比如改变构建流程、或者增加依赖库、工具等',
          value: 'chore'
        },
        {
          name: '重构',
          value: 'refactor'
        },
        {
          name: '撰写文档',
          value: 'docs'
        },
        {
          name: '增加测试',
          value: 'test'
        },
        {
          name: '更新打包文件',
          value: 'build'
        },
        {
          name: '初次提交',
          value: 'init'
        },
        {
          name: '发布/版本标签',
          value: 'release'
        },
        {
          name: '部署功能',
          value: 'deploy'
        },
        {
          name: '代码回滚',
          value: 'revert'
        },
        {
          name: 'CI持续集成修改',
          value: 'ci'
        }
      ]
    }
  ],
  ciMsg: {
    type: 'input',
    name: 'msg',
    message: '请输入提交文本:',
    validate: function (value) {
      if (value) {
        return true
      }
      return '文本必须输入!'
    }
  },
  comptName: {
    type: 'input',
    name: 'name',
    message: '请输入组件名称:',
    validate: function (value) {
      if (/^[\-a-z]+$/.test(value)) {
        return true
      }
      return '组件名称只能包含小写字母和横杠(-)!'
    }
  },
  compConfig: [
    {
      type: 'confirm',
      name: 'needConfig',
      message: '是否需要组件配置文件(普通组件不需要)',
      default: false
    }
  ]
}
```
