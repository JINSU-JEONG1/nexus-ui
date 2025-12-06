import Vue from 'vue'
import VueRouter from 'vue-router'

// routes 정의
import pages from './routes/pages'
import shortUrl from './routes/shortUrl/short-url'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.VITE_APP_BASE_ROUTER_PATH || '/',
  routes: [
    ...pages,
    ...shortUrl
  ]
})
export default router
