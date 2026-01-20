import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import '@/styles/common.css'
import { createPinia, PiniaVuePlugin } from "pinia";

// Toast notifications
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// AG Grid Styles
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

// 3rd party plugins
import '@axios'

// Toast 설정
Vue.use(Toast, {
  position: "top-right",

  transition: "Vue-Toastification__fade",

  timeout: 1200,

  // UI 깔끔하게 하기
  closeButton: false,      
  hideProgressBar: true,   
  icon: true,              

  // 동작 설정
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,

  // 개수 제한
  maxToasts: 3,
  newestOnTop: true
});


Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  router,
  store,
  pinia,
  render: h => h(App)
}).$mount('#app')
