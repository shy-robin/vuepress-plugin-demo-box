<template>
  <div class="info-wrap">
    <div class="info-wrap__avatar" @click="handleClick(name, age)">
      <img :src="headUrl" alt="" />
    </div>
    <div class="info-wrap__right-info">
      <span>姓名：{{ name }}</span>
      <span>性别：{{ genderText }}</span>
      <span>年龄：{{ age }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
// import { defineComponent, computed } from 'vue-demi'

export default defineComponent({
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
  setup(props, { emit }) {
    const genderText = computed(() => {
      if (props.gender === 1) return '男'
      if (props.gender === 2) return '女'
      return '未知'
    })

    const handleClick = (name: string, age: number) => {
      console.log(`Name: ${name}, Age: ${age}`)
      emit('avatarClick')
    }

    return {
      genderText,
      handleClick,
    }
  },
})
</script>

<style scoped lang="less">
.info-wrap {
  display: flex;
  cursor: default;
  &__avatar {
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  &__right-info {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    font-size: 12px;
    margin-left: 10px;
  }
}
</style>
