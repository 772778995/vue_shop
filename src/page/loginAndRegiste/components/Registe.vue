<template>
  <div class="registe_box">
    <!-- 注册表单区域 -->
    <el-form :model="registeForm" ref="registeFormRef" class="registe_form" :rules="rigisteFormRules" status-icon>
      <!-- 邮箱地址 -->
      <el-form-item prop="Email">
        <el-input placeholder="请输入用于注册的邮箱 (必选)" prefix-icon="el-icon-message" v-model="registeForm.Email" @focus="noSendEmail"></el-input>
      </el-form-item>
      <!-- 邮箱验证码 -->
      <el-form-item prop="EmailNum">
        <el-button v-if="registeForm.leftTime" type="primary" disabled>剩余{{registeForm.leftTime}}秒</el-button>
        <el-button v-else type="primary" :disabled="registeForm.isEmailExist" @click="sendEmail">发送邮件验证码</el-button>
        <el-input placeholder="请输入验证码 (必选)" prefix-icon="el-icon-message" class="EmailNum right" v-model="registeForm.EmailNum"></el-input>
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item prop="userName">
        <el-input placeholder="请输入昵称  (必选)" prefix-icon="el-icon-user" v-model="registeForm.userName"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="passWord">
        <el-input type="passWord" placeholder="请输入密码  (必选)" prefix-icon="el-icon-lock" v-model="registeForm.passWord"></el-input>
      </el-form-item>
      <!-- 电话 -->
      <el-form-item prop="tel">
        <el-input placeholder="请输入电话号码  (可选)" prefix-icon="el-icon-phone-outline" v-model="registeForm.tel"></el-input>
      </el-form-item>
      <!-- 注册按钮 -->
      <el-form-item>
        <el-button type="primary" class="block" @click="registe">注册</el-button>
      </el-form-item>
      <!-- 已有账号 -->
      <el-form-item>
        <router-link class="right" to="/loginAndRegiste/login">已经有了账号？</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Registe',
  data () {
    // 检查邮箱是否注册
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱地址'))
      }
      setTimeout(() => {
        this.$axios.post(
          'https://d18c4217.cn/API/email/checkEmailExist.php',
          `Email=${this.registeForm.Email}`
        )
          .then(res => {
            if (res.data === 2) {
              this.registeForm.isEmailExist = false
              callback()
            } else {
              this.registeForm.isEmailExist = true
              callback(new Error('该邮箱地址已被注册或不可用'))
            }
          })
      }, 1000)
    }
    // 判断手机号码的正则
    const checkTel = (rule, value, callback) => {
      if (!(/^1[34578]\d{9}$/.test(value)) && value !== '') {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      registeForm: {
        Email: '',
        isEmailExist: true,
        leftTime: 0,
        EmailNum: '',
        userName: '',
        passWord: '',
        tel: ''
      },
      // 表单校验规则
      rigisteFormRules: {
        Email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        EmailNum: [
          { required: true, message: '验证码不得为空', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '昵称不得为空', trigger: 'blur' },
          { min: 2, max: 12, message: '请输入6-12位字符', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '密码不得为空', trigger: 'blur' },
          { min: 6, max: 12, message: '请输入6-12位字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, validator: checkTel, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //  当邮箱文本框获取焦点，发送邮件按钮不可点击
    noSendEmail: function () {
      this.registeForm.isEmailExist = true
    },
    // 发送邮件验证码
    sendEmail: function () {
      this.countTime()
      const { Email } = this.registeForm
      this.$axios.post(
        'https://d18c4217.cn/API/email/sendEmail.php',
        `Email=${Email}`
      )
        .then(res => {
          console.log(this.registeForm.Email)
          console.log(res)
        })
    },
    countTime: function () {
      this.registeForm.leftTime = 60
      const emailTime = setInterval(() => {
        this.registeForm.leftTime--
        if (!this.registeForm.leftTime) clearInterval(emailTime)
      }, 1000)
    },
    // 注册
    registe: function () {
      this.$refs.registeFormRef.validate(value => {
        if (value) {
          const { Email, EmailNum, userName, passWord, tel } = this.registeForm
          this.$axios.post(
            'https://d18c4217.cn/API/registe.php',
            `Email=${Email}&EmailNum=${EmailNum}&userName=${userName}&passWord=${passWord}&tel=${tel}`
          )
            .then(res => {
              const { data } = res
              if (data === 1) {
                console.log('注册成功')
              } else if (data === 2) {
                console.log('注册失败！')
              } else if (data === 3) {
                console.log('验证码错误或超时！')
              }
            })
        }
      })
    }
  }
}
</script>

<style scoped>
  .registe_box {
    width: 28.125rem; height: 28.125rem;
    background: #fff;
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 0.25rem;
    box-shadow: 0 0 0.625rem #ddd;
  }
  .registe_form {
    padding: 1.875rem;
  }
  .EmailNum{
    width: 12.5rem;
  }
  .right{
    float: right;
    text-align: right;
  }
  .block{
    width: 100%;
  }
</style>
