# Demo

## 普通写法

> Vue2 的普通写法（样式作用在整个页面）

:::demo 这个组件

```vue
<template>
  <div class="demo" @click="handleClick">{{ text }}</div>
</template>

<script>
export default {
  data() {
    return {
      text: 'ClickMe',
    }
  },
  methods: {
    handleClick() {
      this.text += '0'
    },
  },
}
</script>

<style>
.demo {
  background-color: red;
}
</style>
```

:::

> 不支持 CSS 预处理器

:::demo TS, LESS

```vue
<template>
  <div class="demo">
    <span class="text">TEST</span>
  </div>
</template>

<style scoped lang="less">
.demo {
  background-color: green;
  .text {
    color: #fff;
  }
}
</style>
```

:::

## Title1

_HEllO WORLD_

**END LINE**
