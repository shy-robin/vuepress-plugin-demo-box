const parseHtmlToVue = require('../utils/parseHtmlToVue')

module.exports = (md) => {
  // 开启宏任务
  const id = setTimeout(() => {
    const { render } = md
    if (typeof render.call(md, '') === 'object') {
      // 重写 markdown.render 方法
      md.render = (...args) => {
        let result = render.call(md, ...args)
        // 在结果中添加 template，script 和 style
        const { template, script, style } = parseHtmlToVue(result.html)
        /**
         * template 是 markdown 转为 html 的最终格式
         */
        result.html = template
        /**
         * dataBlockString 为符合 Vue Template 语法的代码块；
         * script 里包含对页面所有 demo 组件的引用；
         * style 里包含页面所有 demo 组件的样式；
         */
        result.dataBlockString = `${script}\n${style}\n${result.dataBlockString}`
        return result
      }
    }
    clearTimeout(id)
  }, 0)
}
