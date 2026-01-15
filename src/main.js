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

// 3rd party plugins
import '@axios'

// Toast 설정
Vue.use(Toast, {
  // 위치: 중앙 상단 (버튼 위쪽 느낌을 원하시면 이 위치가 가장 적절)
  position: "top-right",

  // 애니메이션: 기본 'bounce'보다 'fade'가 훨씬 차분하고 부드럽습니다.
  transition: "Vue-Toastification__fade",

  // 시간: 800ms는 너무 빨라서 끊기는 느낌을 줍니다. 
  // 1500~2000ms 정도로 늘려야 여유롭고 부드럽게 느껴집니다.
  timeout: 1200,

  // UI 깔끔하게 하기
  closeButton: false,      // 닫기 버튼 제거 (심플함)
  hideProgressBar: true,   // 진행바 제거 (심플함)
  icon: true,              // 아이콘 유지

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
