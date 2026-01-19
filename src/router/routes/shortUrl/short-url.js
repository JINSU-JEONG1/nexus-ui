export default [
  {
    path: '/short-url',
    name: 'short-url',
    component: () => import('@/views/nexsus-ui/short-url/ShortUrl.vue'),
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
    component: () => import('@/views/nexsus-ui/short-url/ShortUrlStats.vue'),
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