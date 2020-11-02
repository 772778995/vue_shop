<template>
  <div class="login_box">
    <!-- 头像区域 -->
    <div class="avatar_box">
      <img src="../../../assets/img/huaji.png">
    </div>
    <!-- 登陆表单区域 -->
    <el-form
      ref="loginFormRef"
      class="login_form"
      :model="loginForm"
      :rules="loginFormRules"
      status-icon>
        <!-- 邮箱地址 -->
        <el-form-item prop="Email">
          <el-input
            placeholder="请输入邮箱地址"
            v-model="loginForm.Email"
            prefix-icon="el-icon-message">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="passWord">
          <el-input
            type="passWord"
            placeholder="请输入密码"
            v-model="loginForm.passWord"
            prefix-icon="el-icon-lock">
          </el-input>
        </el-form-item>
        <!-- 记住邮箱地址 -->
        <el-form-item>
          <el-checkbox v-model="loginForm.ranUser">
            记住邮箱地址
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <!-- 忘记密码 -->
          <router-link to="/forgetPsd" class="left">
            忘记密码？
          </router-link>
          <div class="btns">
            <!-- 登陆 -->
            <el-button
              type="primary"
              @click="login"
              class="login">
                登陆
            </el-button>
            <!-- 注册 -->
            <router-link to="/loginAndRegiste/registe">
              <el-button type="infor">注册</el-button>
            </router-link>
          </div>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setCookies, getCookies } from '../../../assets/js/cookies.js'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        Email: '',
        passWord: '',
        ranUser: false
      },
      loginFormRules: {
        Email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '请输入6-12位字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login: function () {
      this.$refs.loginFormRef.validate(value => {
        // 如果表单校验成功则执行
        if (value) {
          const { Email, passWord, ranUser } = this.loginForm
          // 向服务器发送请求
          this.$axios.post(
            '/login.php',
            `Email=${Email}&passWord=${passWord}`
          )
            .then(res => {
              // 登陆成功
              if (res.status === 200) {
                this.$message.success('登陆成功！')
                setCookies('Email', Email)
                setCookies('passWord', passWord)
                if (ranUser === true) setCookies('Email', Email, 10)
                return this.$router.push('/home')
              } else {
                // 登陆失败
                this.$message.error('登陆失败！')
              }
            })
        }
      })
    }
  },
  mounted () {
    if (getCookies().Email) this.loginForm.Email = getCookies().Email
  }
}
</script>

<style scoped>
  body {
    margin: 0;
  }
  .login_box {
    width: 450px; height: 300px;
    background: #fff;
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 0.25rem;
    box-shadow: 0 0 0.625rem #ddd;
  }
  .avatar_box {
    width: 5rem; height: 5rem;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    padding: 0.625rem;
    box-shadow: 0 0 0.625rem #ddd;
    position: absolute;
    top: 0;left: 50%;
    transform: translate(-50%,-65%);
  }
  .avatar_box>img {
    width: 100%; height: 100%;
    background-color: #eee;
    border-radius: 50%;
  }
  .login_form{
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 1.875rem;
    box-sizing: border-box;
    padding-bottom: 0;
  }
  .btns{
    float: right;
  }
  .left{
    float: left;
  }
  .login{
    margin-right: 0.9375rem;
  }
</style>
