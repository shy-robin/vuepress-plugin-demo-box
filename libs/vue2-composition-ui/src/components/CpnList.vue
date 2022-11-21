<template>
  <div>
    <cpn-info
      v-for="item in infoArr"
      :key="item.name"
      :name="item.name"
      :gender="item.gender"
      :age="item.age"
      :head-url="item.headUrl"
      @avatar-click="handleAvatarClick"
    ></cpn-info>
  </div>
</template>

<script>
import CpnInfo from './CpnInfo.vue'

export default {
  name: 'CpnList',
  components: {
    CpnInfo,
  },
  data() {
    return {
      infoArr: [
        {
          name: 'Tom',
          gender: 0,
          age: 18,
        },
        {
          name: 'Jack',
          gender: 1,
          age: 28,
          headUrl: 'https://cdn.novenn.com/random/avatars/1595853489661.jpg',
        },
        {
          name: 'Amy',
          gender: 2,
          age: 18,
          headUrl: 'https://cdn.novenn.com/random/avatars/1595853486130.jpg',
        },
      ],
    }
  },
  methods: {
    handleAvatarClick(name) {
      alert(`${name} is clicked!`)
    },
  },
}
</script>

<style></style>
