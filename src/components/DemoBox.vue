<template>
  <div class="demo-box">
    <div class="demo-box__component">
      <slot name="demo"></slot>
    </div>
    <div class="demo-box__operation">
      <icon-code-pen
        class="icon-code-pen"
        @click.native="handleJumpCodePen"
      ></icon-code-pen>
      <icon-copy class="icon-copy" @click.native="handleCopy"></icon-copy>
      <icon-code class="icon-code" @click.native="handleExpand"></icon-code>
    </div>
    <div class="demo-box__meta" ref="meta">
      <div class="demo-box__meta-description">
        <slot name="description"></slot>
      </div>
      <div class="demo-box__meta-source">
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
const compiler = require('@vue/compiler-sfc')

export default {
  name: 'DemoBox',
  components: {
    IconCopy,
    IconCode,
    IconArrowUp,
    IconCodePen,
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
    }
  },
  watch: {
    isExpanded(newVal) {
      this.$refs.meta.style.height = newVal ? `${this.metaElHeight}px` : '0'
    },
  },
  methods: {
    handleExpand() {
      this.isExpanded = !this.isExpanded
    },
    handleCopy() {
      const pre = this.$el.querySelectorAll('pre')[0]
      pre.setAttribute('contenteditable', 'true')
      pre.focus()
      document.execCommand('selectAll', false, null)
      document.execCommand('copy')
      pre.removeAttribute('contenteditable')
    },
    handleJumpCodePen() {
      const sourceCode = this.$el.querySelector('code').innerText
      const { template, script, styles } = compiler.parse({
        source: sourceCode,
      })

      // const el = document.querySelector('#component-refer-map')
      // console.log(JSON.parse(decodeURI(el.dataset.components)))

      // 不能在 `` 中引用凭借的变量，因为会执行脚本
      const htmlTpl =
        '<scr' +
        'ipt src="//unpkg.com/vue@2/dist/vue.js"></scr' +
        'ipt>\n' +
        `<div id="app">\n${template.content.trim()}\n</div>`

      const jsTpl = `${script.content.replace(
        /export default/,
        'var Main ='
      )}\nvar Ctor = Vue.extend(Main)\nnew Ctor().$mount('#app')`

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
  },
  computed: {
    metaElHeight() {
      const el = this.$el.querySelector('.demo-box__meta')
      if (el && el.children) {
        return Array.from(el.children).reduce((p, c) => {
          return p + c.clientHeight
        }, 0)
      }
      return 0
    },
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
  justify-content: flex-end;
  border-top: 1px solid #ddd;
}

.demo-box__meta {
  height: 0;
  overflow: hidden;
  background-color: #282c34;
  transition: height 0.35s ease-out;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.demo-box__meta-description {
  padding: 10px 20px;
  color: #fff;
  background-color: rgba(255, 255, 255, 18%);
}

.icon-code-pen,
.icon-copy,
.icon-code {
  margin-right: 15px;
  cursor: pointer;
}

.hide-source {
  display: flex;
  padding: 10px 0;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 18%);
  align-items: center;
  justify-content: center;
}

.icon-arrow-up {
  margin-right: 5px;
}

.hide-source:hover {
  background-color: rgba(255, 255, 255, 20%);
}

.demo-box__meta-source pre {
  margin: 0 !important;
}
</style>
