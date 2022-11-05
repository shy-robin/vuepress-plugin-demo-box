/**
 * 扫描 :::demo xxx ::: 包裹的代码块，并将 :::demo 和 ::: 替换成特定起始标签和结束标签
 *
 * OUTPUT
 * <${componentName} :options="JSON.parse(decodeURI('%7B%22component%22:%22DemoTest%22%7D'))">
 *  <template slot="demo">
 *    <!--pre-render-demo:<div>TTTTT</div>:pre-render-demo-->
 *  </template>
 *  <div slot="description">
 *    ${md.render(description).html}
 *  </div>
 *  <template slot="source">
 *    XXXXX
 *  </template>
 * </${componentName}>
 */
const markdownItContainer = require('markdown-it-container')

module.exports = (options) => {
  const { component = 'demo-box' } = options

  // AaaBbb => aaa-bbb (对应注册的全局组件 DemoBox)
  const componentName = component
    .replace(/^\S/, (s) => s.toLowerCase())
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()

  return (md) => {
    // 这里的 md 为 markdown-it 实例
    md.use(markdownItContainer, 'demo', {
      validate(params) {
        // 验证 ::: 开头的文本，params 为该文本
        return params.trim().match(/^demo\s*(.*)$/)
      },
      render(tokens, idx) {
        // info 为 ::: 后的字符串
        const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)

        // nesting 为 1 为其实标签，其他为关闭标签
        if (tokens[idx].nesting === 1) {
          const description = m && m.length > 1 ? m[1] : ''
          const content =
            tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
          const encodeOptionsStr = encodeURI(JSON.stringify(options))
          // 自定义起始标签
          return `
              <${componentName} :options="JSON.parse(decodeURI('${encodeOptionsStr}'))" :cpn-id="${idx}">
                <template slot="demo">
                  <!--pre-render-demo:CPN_ID--${idx}--CPN_ID${content}:pre-render-demo-->
                </template>
                ${
                  description
                    ? `<div slot="description">${
                        md.render(description).html
                      }</div>`
                    : ''
                }
              <template slot="source">
            `
        }
        // 自定义结束标签
        return `
                </template>
              </${componentName}>
          `
      },
    })
  }
}
