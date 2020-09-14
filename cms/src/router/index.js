import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登陆组件
import login from "../components/login.vue";
import home from "../components/home.vue";
import welcome from "../components/welcome.vue"
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', component: login },
  {
    path: '/home', component: home, redirect: '/welcome', children: [
      { path: '/welcome', component: welcome }
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
