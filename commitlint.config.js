module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
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
    ]
  }
}
