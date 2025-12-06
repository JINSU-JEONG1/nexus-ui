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
];