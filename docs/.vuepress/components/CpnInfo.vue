<template>
  <div class="info-wrap">
    <div class="avatar" @click="$emit('avatarClick', name)">
      <img :src="headUrl" alt="" />
    </div>
    <div class="right-info">
      <span>姓名：{{ name }}</span>
      <span>性别：{{ gender ? (gender === 1 ? '男' : '女') : '未知' }}</span>
      <span>年龄：{{ age }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CpnInfo',
  props: {
    name: {
      type: String,
      default: 'Name',
    },
    gender: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
      default: 18,
    },
    headUrl: {
      type: String,
      default: 'https://cdn.novenn.com/random/avatars/1595853587633.jpg',
    },
  },
  emits: ['avatarClick'],
  data() {
    return {}
  },
}
</script>

<style>
.info-wrap {
  display: flex;
  cursor: default;
}
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.right-info {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  font-size: 12px;
  margin-left: 10px;
}
</style>
