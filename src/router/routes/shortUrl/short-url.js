export default [
  {
    path: '/short-url',
    name: 'short-url',
    component: () => import('@/views/nexsus-ui/short-url/ShortUrlPage.vue'),
    meta: {
      pageTitle: 'Short URL',
      breadcrumb: [
        {
          text: 'Short URL',
          active: true,
        },
      ],
    },
  },
  {
    path: '/short-url/statistics',
    name: 'short-url-statistics',
    component: () => import('@/views/nexsus-ui/short-url/StatisticsPage.vue'),
    meta: {
      pageTitle: 'Statistics',
      breadcrumb: [
        {
          text: 'Short URL',
          active: false,
        },
        {
          text: 'Statistics',
          active: true,
        },
      ],
    },
  },
];