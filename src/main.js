import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/styles/common.css'
import { createPinia, PiniaVuePlugin } from "pinia";

Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  router,
  store,
  pinia,
  render: h => h(App)
}).$mount('#app')
