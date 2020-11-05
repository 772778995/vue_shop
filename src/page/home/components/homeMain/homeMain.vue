<template>
  <el-main>
    <router-view :userInfo="userInfo"></router-view>
  </el-main>
</template>

<script>
export default {
  name: 'homeMain',
  props: [
    'userInfo'
  ]
}
</script>

<style>
  .el-main { background-color: #f1eefc; }
</style>
