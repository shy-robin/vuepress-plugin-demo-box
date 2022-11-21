import Vue from 'vue'
import App from './App.vue'
// import CompositionApi from '@vue/composition-api'

// Vue.use(CompositionApi)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
