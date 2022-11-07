const { COMMENT_START, COMMENT_END } = require('./constant')
const sfcCompiler = require('@vue/compiler-sfc')
const { compileTemplate } = require('@vue/component-compiler-utils')
const vueTplCompiler = require('vue-template-compiler')

const genInlineComponentText = (template, script) => {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  const finalOptions = {
    source: `<div>${template}</div>`,
    filename: 'inline-component', // TODO：这里有待调整
    compiler: vueTplCompiler,
  }
  const compiled = compileTemplate(finalOptions)

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach((tip) => {
      console.warn(tip)
    })
  }

  const pad = (source) => {
    return source
      .split(/\r?\n/)
      .map((line) => `  ${line}`)
      .join('\n')
  }

  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
        compiled.errors.map((e) => `  - ${e}`).join('\n') +
        '\n'
    )
  }

  // code 为编译得到的 render 函数
  const { code } = compiled

  // todo: 这里采用了硬编码有待改进
  script = script.trim()

  if (script) {
    script = script.replace(/export\s+default/, 'const demoComponentExport =')
  } else {
    script = 'const demoComponentExport = {}'
  }

  return `(function() {
    ${code}
    ${script}
    return {
      render,
      staticRenderFns,
      ...demoComponentExport
    }
  })()`
}

/**
 * 合并所有 demo 的 style
 */
const mergeStyle = (styleArr) => {
  if (Array.isArray(styleArr) && styleArr.length > 0) {
    return `<style>${styleArr.join('')}</style>`
  }
  return `<style></style>`
}

/**
 * 将所有 demo 组件引入
 */
const generateScript = (componentRefMap) => {
  // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
  // TODO: 优化这段逻辑
  const keys = Object.keys(componentRefMap)
  if (keys.length) {
    return `
      <script>
        export default {
          name: 'component-doc',
          components: {
            ${keys.map((key) => `'${key}': ${componentRefMap[key]}`).join(', ')}
          }
        }
      </script>
    `
  }
  return ''
}

const parseContent = (str) => {
  const pattern = /CPN_ID--(.*)--CPN_ID/
  const matchRst = pattern.exec(str)
  const id = matchRst ? matchRst[1] : 'null'
  const content = str.replace(/CPN_ID--(.*)--CPN_ID/, '')

  /**
   * 解析 Vue 文件的 template、script、styles（template 和 script 只能解析一个，若有多个只能解析出最后一个）
   */
  const { template, script, styles } = sfcCompiler.parse({
    source: content,
  })

  const demoComponentContent = genInlineComponentText(
    template ? template.content : '',
    script ? script.content : ''
  ) // 示例组件代码内容
  const demoComponentName = `render-demo-${id}` // 示例代码组件名称

  return {
    componentName: demoComponentName,
    component: demoComponentContent,
    style: styles.map((item) => item.content).join('\n'),
    id,
  }
}

const parseHtmlToVue = (html) => {
  if (!html) {
    return html
  }

  const startCommentLen = COMMENT_START.length
  const endCommentLen = COMMENT_END.length
  let startCommentIdx = html.indexOf(COMMENT_START)
  let endCommentIdx = html.indexOf(
    COMMENT_END,
    startCommentIdx + startCommentLen
  )

  const templateArr = [] // 非 demo 内容和 demo 组件的数组
  const styleArr = [] // 所有 demo 的 style 数组
  let componentReferMap = {} // 组件引用代码
  let id = 0 // demo 组件的 id
  let start = 0 // 字符串开始位置

  while (startCommentIdx !== -1 && endCommentIdx !== -1) {
    templateArr.push(html.slice(start, startCommentIdx))
    const commentContent = html.slice(
      startCommentIdx + startCommentLen,
      endCommentIdx
    )

    const {
      componentName,
      component,
      style,
      id: cpnId,
    } = parseContent(commentContent)
    templateArr.push(`<template><${componentName} /></template>`)
    templateArr.push(
      `<span id="demo-cpn-${cpnId}" data-component="${encodeURI(
        JSON.stringify(component)
      )}"></span>`
    )
    styleArr.push(style)
    Reflect.set(componentReferMap, componentName, component)

    // 重新计算下一次的位置
    id++
    start = endCommentIdx + endCommentLen
    startCommentIdx = html.indexOf(COMMENT_START, start)
    endCommentIdx = html.indexOf(COMMENT_END, startCommentIdx + startCommentLen)
  }

  templateArr.push(html.slice(start))

  return {
    template: templateArr.join(''),
    script: generateScript(componentReferMap),
    style: mergeStyle(styleArr),
  }
}

module.exports = parseHtmlToVue
