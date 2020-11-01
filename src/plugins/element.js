import Vue from 'vue'
import { Button, Form, FormItem, Input, Checkbox, Icon, Loading } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Loading)

Vue.prototype.openLoading = function () {
  // 声明一个loading对象
  const loading = this.$loading({
    // 是否锁屏
    lock: true,
    // 加载动画的文字
    text: '请稍后……',
    // 引入的loading图标
    // spinner: 'el-icon-loading',
    // 背景颜色
    // background: 'rgba(0, 0, 0, 0.3)',
    // 需要遮罩的区域
    // target: '.sub-main',
    body: true
    // 遮罩层新增类名
    // customClass: 'mask'
  })
  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
  setTimeout(function () {
    // 关闭遮罩层
    loading.close()
  }, 10000)
  return loading
}
