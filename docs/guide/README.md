# Demo

## 普通写法

> Vue2 的普通写法

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

## Title1

_HEllO WORLD_

**END LINE**
