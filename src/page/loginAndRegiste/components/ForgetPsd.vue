<template>
  <div class="warpper">
    <!-- 忘记密码表单 -->
    <el-form :model="forgetPsdForm" :rules="forgetPsdFormRules" ref="forgetPsdFormRef" status-icon>
      <!-- 邮箱地址 -->
      <el-form-item prop="Email">
        <el-input v-model="forgetPsdForm.Email" placeholder="请输入您的邮箱地址"></el-input>
      </el-form-item>
      <!-- 邮件验证码区域 -->
      <el-form-item>
        <el-row :gutter="0">
          <el-col :span="20">
            <el-button
            v-if="forgetPsdForm.leftTime>0"
            disabled
            type="primary">
              剩余{{forgetPsdForm.leftTime}}秒
            </el-button>
            <el-button
              v-else
              :disabled="!forgetPsdForm.isEmailExist"
              @click="sendEmail"
              type="primary">
                发送邮件
              </el-button>
          </el-col>
          <el-col :span="4">
            <router-link to="/loginAndRegiste/login">
              前往登陆
            </router-link>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setCookies, getCookies } from '../../../assets/js/cookies.js'
export default {
  name: 'ForgetPsd',
  data () {
    const checkEmail = (rule, value, callback) => {
      this.$axios.post(
        '/email/checkEmailExist.php',
        `Email=${this.forgetPsdForm.Email}`
      )
        .then(res => {
          if (res.data === 2) {
            this.forgetPsdForm.isEmailExist = false
            callback(new Error('该邮箱地址不存在！'))
            this.forgetPsdForm.isEmailExist = false
          } else {
            this.forgetPsdForm.isEmailExist = true
            callback()
            this.forgetPsdForm.isEmailExist = true
          }
        })
    }
    return {
      forgetPsdForm: {
        Email: '',
        isEmailExist: false,
        leftTime: 0
      },
      forgetPsdFormRules: {
        Email: [
          { required: true, message: '请输入邮箱地址！', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendEmail () {
      this.countTime()
      const { Email } = this.forgetPsdForm
      this.$axios.post(
        '/email/getPsdEmail.php',
        `Email=${Email}`
      )
        .then(res => {
          if (res.status === 200) this.$messageBox.alert('请注意查收邮件查看您的密码！')
          else this.$message.error('发送邮件失败！')
        })
    },
    // 计时器
    countEmailTime () {
      const emailTime = setInterval(() => {
        this.forgetPsdForm.leftTime--
        if (!this.forgetPsdForm.leftTime) clearInterval(emailTime)
      }, 1000)
    },
    // 发送邮件后记录cookies
    countTime: function () {
      const overTime = Math.floor(new Date().getTime() / 1000) + 60
      this.forgetPsdForm.leftTime = 60
      setCookies('overTime', overTime, 1)
      // 调用计时器
      this.countEmailTime()
    },
    // 根据cookies倒计时
    howMuchTime () {
      if (getCookies().overTime) {
        const leftTime = getCookies().overTime - Math.floor(new Date().getTime() / 1000)
        if (leftTime > 0) {
          this.forgetPsdForm.leftTime = leftTime
          // 调用计时器
          this.countEmailTime()
        } else setCookies('overTime', '', -1)
      }
    }
  },
  created () {
    this.howMuchTime()
  }
}
</script>

<style scoped>
  .warpper {
    width: 400px;
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%,-50%);
    background-color: #FFFFFF;
    border-radius: 0.25rem;
    padding: 40px;
    padding-bottom: 0;
  }
</style>
