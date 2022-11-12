# Demo

## 自定义组件

:::demo Info

```vue
<template>
  <div>
    <el-button type="primary" @click="handleClick">{{ btnText }}</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnText: '主要按钮',
    }
  },
  methods: {
    handleClick() {
      console.log('clicked!!!')
    },
  },
}
</script>

<style scoped>
.el-button {
  padding: 20px;
}
</style>
```

:::

:::demo Info List

```vue
<template>
  <cpn-list />
</template>
```

:::
