/**
 * 提供 :::demo xxx ::: 语法，用于构建 markdown 中的组件示例
 */
const path = require('path')
const renderContainer = require('./plugins/renderContainer')
const renderMarkdown = require('./plugins/renderMarkdown')

module.exports = (options = {}, ctx) => {
  return {
    // 注册全局 DemoBox 组件
    enhanceAppFiles: path.resolve(__dirname, './enhanceAppFile.js'),
    // 修改内部用于渲染 markdown 文件的 markdown-it 实例的配置或者应用一些额外的插件
    extendMarkdown(md) {
      // 添加插件
      md.use(renderContainer(options)) // 基于 markdown-it-container 识别并替换 :::demo xxx ::: 标签
      md.use(renderMarkdown) // 重写 render 方法，将 demo 转换成组件并引入到页面中
    },
  }
}
