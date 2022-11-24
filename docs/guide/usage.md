# 用法

::: warning
插件基于 vuepress1.x 版本实现，由于 vuepress1.x 仅支持 vue2，所以请确保组件库以及 demo 示例使用 vue2 的写法。
:::

## 安装

使用 yarn 进行安装：

```sh
yarn add vuepress-plugin-demo-box -D
```

或者使用 npm 进行安装：

```sh
npm install vuepress-plugin-demo-box -D
```

## 配置

### 引入插件

在 `.vuepress` 文件夹下创建 `config.js` 文件，引入插件：

```js
// 组件库以 element-ui 为例
module.exports = {
  plugins: [
    [
      require('vuepress-plugin-demo-box'),
      {
        // 组件库 cdn 地址 【必传，否则无法编辑渲染及跳转至 CodePen】
        cpnLibUrl: 'https://cdn.jsdelivr.net/npm/element-ui',
        // 组件库样式 cdn 地址【必传，否则组件无法具备样式】
        cpnStyleUrl:
          'https://cdn.jsdelivr.net/npm/element-ui/lib/theme-chalk/index.css',
        // Vue cdn 地址【选传，仅支持 Vue2.x 版本】
        vueUrl: 'https://cdn.jsdelivr.net/npm/vue@2.6.14',
      },
    ],
  ],
}
```

### 注册全局组件

> 注册的全局组件可以直接在 demo 中使用，不需要局部导入。

#### 自动注册

如果只是少量的简单组件，可以在 `.vuepress` 文件夹下创建 `components` 目录，该目录下编写的所有组件将会自动注册为全局组件。

具体参考：<https://v1.vuepress.vuejs.org/guide/using-vue.html#using-components>

::: danger
注意，自动注册的组件无法在代码块中编辑并重新渲染。
:::

#### 手动注册

如果是大量的复杂组件，一般会选择将它们封装到一个组件库中，这些组件需要手动注册，可以在 `.vuepress` 文件夹下创建 `enhanceApp.js` 文件，写入如下配置：

```js
// 以 element-ui 为例
import Element from 'element-ui' // 组件库
import 'element-ui/lib/theme-chalk/index.css' // 组件库样式

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
  Vue.use(Element)
}
```
