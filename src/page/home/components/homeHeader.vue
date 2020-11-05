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
      <span class="userName">
        欢迎您!
        <b>{{userInfo.name}}</b>
      </span>
      <el-tag v-if="userInfo.power>300">{{userInfo.object}}</el-tag>
      <el-tag v-else-if="userInfo.power==201" type="success">{{userInfo.object}}</el-tag>
      <el-tag v-else-if="userInfo.power>100 && userInfo.power<200" type="warning">{{userInfo.object}}</el-tag>
      <el-tag v-else type="info">{{userInfo.object}}</el-tag>
      <!-- 退出登陆 -->
      <el-button @click="loginOut">退出</el-button>
    </div>
  </div>
</template>

<script>
import { setCookies } from '../../../assets/js/cookies.js'
export default {
  name: 'homeHeader',
  props: [
    'userInfo'
  ],
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
  .el-tag {
    margin: 0 15px;
  }
</style>
