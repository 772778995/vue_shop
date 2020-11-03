<template>
  <el-main>
    <router-view :localPsd="localPsd"></router-view>
  </el-main>
</template>

<script>
export default {
  name: 'homeMain',
  props: [
    'localPsd'
  ]
}
</script>

<style>
  .el-main { background-color: #f1eefc; }
</style>
