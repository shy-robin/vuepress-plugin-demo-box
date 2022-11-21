import CpnInfo from './CpnInfo.vue'
import CpnList from './CpnList.vue'
import HelloWorld from './HelloWorld.vue'
import vueCompositionApi from '@vue/composition-api'

const components = [CpnInfo, CpnList, HelloWorld]

// 将所有组件注册为全局组件
const install = function (Vue) {
  components.forEach((component) => {
    Vue.use(vueCompositionApi)
    Vue.component(component.name, component)
  })
}

// 如果用 script 引入 Vue，向 window.Vue 中注册组件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components,
}
