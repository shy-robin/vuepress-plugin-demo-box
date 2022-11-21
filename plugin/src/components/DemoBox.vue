<template>
  <div class="demo-box" ref="demoBox">
    <div class="demo-box__component" ref="cpnRef">
      <slot name="demo"></slot>
    </div>
    <div class="demo-box__operation">
      <div class="demo-box__operation-left" ref="operationLeft">
        <icon-done v-if="isRun" class="icon-run-done"></icon-done>
        <icon-run v-else class="icon-run" @click.native="handleRun"></icon-run>
      </div>
      <div class="demo-box__operation-right">
        <icon-code-pen
          class="icon-code-pen"
          @click.native="handleJumpCodePen"
        ></icon-code-pen>
        <icon-done v-if="isCopied" class="icon-done"></icon-done>
        <icon-copy
          v-else
          class="icon-copy"
          @click.native="handleCopy"
        ></icon-copy>
        <icon-code class="icon-code" @click.native="handleExpand"></icon-code>
      </div>
    </div>
    <div class="demo-box__meta" ref="meta">
      <div class="demo-box__meta-description">
        <slot name="description"></slot>
      </div>
      <div class="demo-box__meta-source">
        <source-code :code.sync="code"></source-code>
        <slot name="source"></slot>
      </div>
      <div class="hide-source" @click="handleExpand">
        <icon-arrow-up class="icon-arrow-up"></icon-arrow-up>
        <span>隐藏源代码</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconCopy from './icons/IconCopy.vue'
import IconCode from './icons/IconCode.vue'
import IconArrowUp from './icons/IconArrowUp.vue'
import IconCodePen from './icons/IconCodePen.vue'
import IconDone from './icons/IconDone.vue'
import IconRun from './icons/IconRun.vue'
import SourceCode from './SourceCode.vue'
const { parseComponent } = require('../utils/compiler-sfc')

export default {
  name: 'DemoBox',
  components: {
    IconCopy,
    IconCode,
    IconArrowUp,
    IconCodePen,
    IconDone,
    IconRun,
    SourceCode,
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      isExpanded: false,
      isCopied: false,
      isRun: false,
      code: '',
      metaElHeight: 0,
      cpnLibUrl: this.options.cpnLibUrl || '',
      cpnStyleUrl: this.options.cpnStyleUrl || '',
      vueUrl: this.options.vueUrl || 'https://cdn.jsdelivr.net/npm/vue@2.6.14',
    }
  },
  watch: {
    isExpanded(newVal) {
      this.$refs.meta.style.height = newVal ? `${this.metaElHeight}px` : '0'
      this.$refs.operationLeft.style.marginLeft = newVal ? '0' : '-36px'
    },
    metaElHeight(newVal) {
      if (this.isExpanded) {
        this.$refs.meta.style.height = `${newVal}px`
      }
    },
  },
  methods: {
    handleExpand() {
      this.isExpanded = !this.isExpanded
    },
    handleCopy() {
      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(this.code)
      } else {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        // 隐藏此输入框
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        // 赋值
        textarea.value = this.code
        // 选中
        textarea.select()
        // 复制
        document.execCommand('copy', true)
        // 移除输入框
        document.body.removeChild(textarea)
      }
      this.isCopied = true
      const timer = setTimeout(() => {
        this.isCopied = false
        clearTimeout(timer)
      }, 2000)
    },
    handleJumpCodePen() {
      const genScript = (url) => {
        // 不能在 `` 中引用凭借的变量，因为会执行脚本
        return '<scr' + `ipt src="${url}"></scr` + 'ipt>\n'
      }
      const { template, script, styles } = parseComponent(this.code)

      const styleLink = this.cpnStyleUrl
        ? `<link rel="stylesheet" href="${this.cpnStyleUrl}">\n`
        : ''
      const htmlTpl =
        genScript(this.vueUrl) +
        genScript(this.cpnLibUrl) +
        styleLink +
        `<div id="app">\n${template ? template.content.trim() : ''}\n</div>`

      let jsTpl = ''
      if (script && script.content) {
        jsTpl = `${script.content.replace(
          /export\s+default/,
          'const config ='
        )}\nconst Cpn = Vue.extend(config)\nnew Cpn().$mount('#app')`
      } else {
        jsTpl = "new Vue().$mount('#app')"
      }

      const cssTpl = styles.map((item) => item.content.trim()).join('\n')

      const data = {
        html: htmlTpl,
        js: jsTpl,
        css: cssTpl,
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://codepen.io/pen/define/'
      form.target = '_blank'
      form.style.display = 'none'

      const input = document.createElement('input')
      input.setAttribute('name', 'data')
      input.setAttribute('type', 'hidden')
      input.setAttribute('value', JSON.stringify(data))

      form.appendChild(input)
      document.body.appendChild(form)

      form.submit()
    },
    handleRun() {
      const { template, script, styles } = parseComponent(this.code)

      const scriptExport = script
        ? eval(`(() => (${script.content.replace(/export\s+default/, '')}))()`)
        : {}

      const NewDemo = window.Vue.extend({
        template: template ? template.content : '',
        ...scriptExport,
      })

      Array.from(this.$refs.cpnRef.children).forEach((el) => {
        this.$refs.cpnRef.removeChild(el)
      })
      const newDemo = new NewDemo().$mount()
      this.$refs.cpnRef.appendChild(newDemo.$el)

      if (styles.length) {
        const styleTag = document.createElement('style')
        styleTag.type = 'text/css'
        styleTag.innerHTML = styles.map((item) => item.content).join('\n')
        this.$refs.cpnRef.appendChild(styleTag)
      }

      this.isRun = true
      const timer = setTimeout(() => {
        this.isRun = false
        clearTimeout(timer)
      }, 2000)
    },
    computeMetaElHeight() {
      const el = this.$el.querySelector('.demo-box__meta')
      if (el && el.children) {
        this.metaElHeight = Array.from(el.children).reduce((p, c) => {
          return p + c.clientHeight
        }, 0)
      } else {
        this.metaElHeight = 0
      }
    },
  },
  async mounted() {
    // 获取源码
    this.code = this.$el.querySelector('code').innerText
    // 隐藏 vuepress 渲染的代码块
    this.$el.querySelector('.language-vue').style.display = 'none'
    // 初始化高度
    this.computeMetaElHeight()
    // 监听代码块的高度变化
    const sourceEl = this.$el.querySelector('.demo-box__meta-source')
    const MutationObserver =
      window.MutationObserver ||
      window.webkitMutationObserver ||
      window.MozMutationObserver
    const mutationObserver = new MutationObserver(() => {
      this.computeMetaElHeight()
    })
    mutationObserver.observe(sourceEl, {
      childList: true, // 监听子元素的变化
      subtree: true, // 将观察器应用于该节点的所有后代节点
    })

    const addScript = (url) => {
      // 脚本会因资源大小导致加载完成时间存在差异
      return new Promise((resolve, reject) => {
        const existScript = Array.from(
          document.querySelectorAll('head > script')
        ).some((script) => script.src === url)

        if (!existScript) {
          const scriptEl = document.createElement('script')
          scriptEl.src = url
          scriptEl.onload = () => {
            resolve(true)
          }
          document.head.appendChild(scriptEl)
        }
      })
    }

    // 引入 Vue
    await addScript(this.vueUrl)
    // 引入组件库
    await addScript(this.cpnLibUrl)
  },
}
</script>

<style scoped>
.demo-box {
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.demo-box__component {
  padding: 20px;
}

.demo-box__operation {
  display: flex;
  padding: 10px 0;
  justify-content: space-between;
  border-top: 1px solid #ddd;
}

.demo-box__meta {
  height: 0;
  overflow: hidden;
  background-color: #282c34;
  transition: height 0.35s ease-out;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  position: relative;
}

.demo-box__meta-description {
  padding: 10px 20px;
  color: #fff;
  background-color: rgba(255, 255, 255, 10%);
}

.icon-code-pen,
.icon-copy,
.icon-done,
.icon-code {
  margin-right: 15px;
  cursor: pointer;
}

.icon-run,
.icon-run-done {
  cursor: pointer;
  margin-left: 15px;
}
.demo-box__operation {
  overflow: hidden;
}
.demo-box__operation-left {
  margin-left: -36px;
  transition: all 0.3s ease-out;
}

.hide-source {
  display: flex;
  padding: 10px 0;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 10%);
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.icon-arrow-up {
  margin-right: 5px;
}

.hide-source:hover {
  background-color: rgba(255, 255, 255, 20%);
}
</style>
