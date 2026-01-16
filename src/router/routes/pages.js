export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/pages/Home.vue')
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },


]