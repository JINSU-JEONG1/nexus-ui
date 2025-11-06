import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // 라우트 레벨 코드 스플리팅
      component: () => import('../views/AboutView.vue')
    }
  ]
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  // 인증이 필요한 라우트 체크
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})

export default router

