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
            placeholder="请输入邮箱"
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
        <el-form-item>
          <el-checkbox v-model="loginForm.renUser">
            记住用户名
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
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        Email: '',
        passWord: '',
        remUser: ''
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
      this.openLoading()
      this.$refs.loginFormRef.validate(value => {
        if (value) {
          const { Email, passWord } = this.loginForm
          this.$axios.post(
            'https://d18c4217.cn/API/login.php',
            `Email=${Email}&passWord=${passWord}`
          )
            .then(res => {
              if (res.data) {
                console.log('登陆成功！')
              } else {
                console.log('登陆失败！')
              }
            })
        }
      })
    }
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
