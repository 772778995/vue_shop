import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginAndRegiste from '../page/loginAndRegiste/LoginAndRegiste.vue'
import Login from '../page/loginAndRegiste/components/Login.vue'
import Registe from '../page/loginAndRegiste/components/Registe.vue'
import Home from '../page/home/Home.vue'
import Welcome from '../page/home/components/homeMain/components/Welcome.vue'
import UserList from '../page/home/components/homeMain/components/UserList.vue'
import RoleList from '../page/home/components/homeMain/components/RoleList.vue'
import { getCookies } from '../assets/js/cookies.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/loginAndRegiste/login',
    component: LoginAndRegiste
  },
  {
    path: '/loginAndRegiste',
    component: LoginAndRegiste,
    children: [
      {
        path: '/loginAndRegiste/login',
        component: Login
      },
      {
        path: '/loginAndRegiste/registe',
        component: Registe
      }
    ]
  },
  {
    path: '/home',
    redirect: '/home/welcome',
    component: Home,
    children: [
      {
        path: '/home/welcome',
        component: Welcome
      },
      {
        path: '/home/userList',
        component: UserList
      },
      {
        path: '/home/roleList',
        component: RoleList
      }
    ],
    beforeEnter: (to, from, next) => {
      const { Email, passWord } = getCookies()
      if (!Email || !passWord) next('/loginAndRegiste/login')
      else next()
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
