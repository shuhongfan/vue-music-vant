import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './vant/vant'
import 'normalize.css'

// axios
import axios from 'axios'
axios.defaults.baseURL = 'https://autumnfish.cn/'
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
