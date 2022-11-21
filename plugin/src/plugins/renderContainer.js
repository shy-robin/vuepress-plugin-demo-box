/**
 * 扫描 :::demo xxx ::: 包裹的代码块，并将 :::demo 和 ::: 替换成特定起始标签和结束标签
 *
 * OUTPUT
 * <DemoBox :options="JSON.parse(decodeURI('%7B%22component%22:%22DemoTest%22%7D'))">
 *  <template slot="demo">
 *    <!--pre-render-demo:<div>TTTTT</div>:pre-render-demo-->
 *  </template>
 *  <div slot="description">
 *    ${md.render(description).html}
 *  </div>
 *  <template slot="source">
 *    XXXXX
 *  </template>
 * </DemoBox>
 */
const markdownItContainer = require('markdown-it-container')

module.exports = (options) => {
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
              <DemoBox :options="JSON.parse(decodeURI('${encodeOptionsStr}'))">
                <template slot="demo">
                  <!--pre-render-demo:${content}:pre-render-demo-->
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
              </DemoBox>
          `
      },
    })
  }
}
