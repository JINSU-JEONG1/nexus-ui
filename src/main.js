import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import '@/styles/common.css'
import { createPinia } from 'pinia'

// Toast notifications
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// 3rd party plugins
import '@axios'

// Create Vue app
const app = createApp(App)

// Use plugins
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Toast 설정
app.use(Toast, {
  position: 'top-right',
  transition: 'Vue-Toastification__fade',
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
})

// Mount app
app.mount('#app')
