import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登陆组件
import login from "../components/login.vue";
import home from "../components/home.vue";
import welcome from "../components/welcome.vue"
import users from "../components/user/users.vue"
import rights from "../components/user/rights.vue"
import roles from "../components/user/roles.vue"
import categories from "../components/user/categories.vue"
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', component: login },

  {
    path: '/home', component: home, redirect: '/welcome', children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: categories },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') { next() }
  else {
    const token = sessionStorage.getItem('token')
    if (!token) { return next('/login') }
    else { next() }
  }
})
export default router
