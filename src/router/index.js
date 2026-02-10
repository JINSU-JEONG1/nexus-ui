import { createRouter, createWebHistory } from 'vue-router'

// routes 정의
import pages from './routes/pages'
import shortUrl from './routes/shortUrl/short-url'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_ROUTER_PATH || '/'),
  routes: [
    ...pages,
    ...shortUrl
  ]
})

export default router
