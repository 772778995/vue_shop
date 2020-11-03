<template>
  <div class="header_box">
    <div class="logo">
      <!-- 滑稽 -->
      <img src="../../../assets/img/huaji.png">
      <!-- 标题 -->
      <h1>电商后台管理系统</h1>
    </div>
    <div>
      <!-- 用户名 -->
      <span class="userName">欢迎您</span>
      <!-- 退出登陆 -->
      <el-button @click="loginOut">退出</el-button>
    </div>
  </div>
</template>

<script>
import { setCookies } from '../../../assets/js/cookies.js'
export default {
  name: 'homeHeader',
  methods: {
    // 退出登陆
    loginOut: function () {
      setCookies('Email', null, -1)
      setCookies('passWord', null, -1)
      this.$router.push('/loginAndRegiste/login')
    }
  }
}
</script>

<style>
  .header_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFFFFF;
  }
  .logo {
    display: flex;
    align-items: center;
  }
  .logo h1 {
    margin-left: 0.9375rem;
    font-size: 20px;
  }
  .userName {
    margin-right: 0.9375rem;
  }
</style>
