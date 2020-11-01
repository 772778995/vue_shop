import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'https://d18c4217.cn/API'
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
