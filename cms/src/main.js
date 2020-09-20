import Vue from 'vue'
import App from './App.vue'
import TreeTable from 'vue-table-with-tree-grid'
import router from './router'
import './plugins/element.js'
import axios from "axios"
import '../fonts/iconfont.css'
import './components/user/globle.css'
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
