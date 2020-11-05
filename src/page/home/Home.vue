<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <home-header
        :userInfo="userInfo"
      />
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <home-aside/>
      <!-- 主题内容 -->
      <home-main
        :userInfo="userInfo"
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
      localPsd: `Email=${getCookies().Email}&passWord=${getCookies().passWord}`,
      userInfo: {
        id: '',
        Email: '',
        name: '',
        object: '',
        power: '',
        avatat: ''
      }
    }
  },
  methods: {
    // 获取用户信息
    getUserInfo: function () {
      this.$axios.post(
        '/vue_shop/getUserInfo.php',
        this.localPsd
      ).then(res => {
        const { id, Email, name, object, power, avatat } = res.data[0]
        this.userInfo.id = id
        this.userInfo.Email = Email
        this.userInfo.name = name
        this.userInfo.object = object
        this.userInfo.power = power
        this.userInfo.avatat = avatat
      })
    }
  },
  mounted () {
    this.getUserInfo()
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
