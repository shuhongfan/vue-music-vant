import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './vant/vant'
// import '../node_modules/normalize.css/normalize.css'
// 导入npress
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 导入moment
import moment from 'moment'

// axios
import axios from 'axios'
axios.defaults.baseURL = 'https://autumnfish.cn/'
Vue.prototype.axios = axios
// axios request拦截器 展示进度条 NProgress.start()
axios.interceptors.request.use(conifg => {
  NProgress.start()
  return conifg
})
// axios response拦截器 隐藏进度条 NProgress.done()
axios.interceptors.response.use(conifg => {
  NProgress.done()
  return conifg
})

// 定义时间过滤器
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern)
})
Vue.filter('timeformat', (dataStr, pattern = 'mm:ss') => {
  return moment(dataStr).format(pattern)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
