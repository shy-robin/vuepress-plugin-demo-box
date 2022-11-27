// import DemoUI from 'shy-robin-demo-ui/lib/demo-ui.umd'
// import 'shy-robin-demo-ui/lib/demo-ui.css'
// import Vue2UI from 'vue2-ui'
// import 'vue2-ui/dist/vue2-ui.css'
import Vue2CompositionUI from 'shy-robin-vue2-composition-ui'
import 'shy-robin-vue2-composition-ui/dist/vue2-composition-ui.css'

/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  // ...apply enhancements for the site.
  // Vue.use(DemoUI)
  // Vue.use(Vue2UI)
  Vue.use(Vue2CompositionUI)
}
