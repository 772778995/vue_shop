<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <home-header/>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <home-aside/>
      <!-- 主题内容 -->
      <home-main
        :localPsd="localPsd"
      />
    </el-container>
  </el-container>
</template>

<script>
import { getCookies } from '../../assets/js/cookies.js'
import homeHeader from './components/homeHeader.vue'
import homeAside from './components/homeAside.vue'
import homeMain from './components/homeMain/homeMain.vue'
export default {
  name: 'Home',
  data () {
    return {
      // 获取cookie下的用户密码
      localPsd: `Email=${getCookies().Email}&passWord=${getCookies().passWord}`
    }
  },
  components: {
    homeHeader,
    homeAside,
    homeMain
  }
}
</script>

<style scoped>
  .el-header { background-color: #a5bcff; }
  .el-container { height: 100%; }
</style>
