import DemoBox from './components/DemoBox.vue'

export default ({ Vue }) => {
  // 将 DemoBox 注册为全局组件
  Vue.component('DemoBox', DemoBox)
}
