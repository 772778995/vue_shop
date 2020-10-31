import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginAndRegiste from '../page/loginAndRegiste/LoginAndRegiste.vue'
import Login from '../page/loginAndRegiste/components/Login.vue'
import Registe from '../page/loginAndRegiste/components/Registe.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/loginAndRegiste/login',
    component: LoginAndRegiste,
    children: [
      { path: '/loginAndRegiste/login', component: Login },
      { path: '/loginAndRegiste/registe', component: Registe }
    ]
  },
  { path: '/loginAndRegiste', component: LoginAndRegiste }
]

const router = new VueRouter({
  routes
})

export default router
