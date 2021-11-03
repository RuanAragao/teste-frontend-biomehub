const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    name: 'list',
    children: [
      { path: '', component: () => import('pages/Index.vue'), props: true },
    ],
    props: {
      name: null,
    },
  },
  {
    path: '/edit/:id',
    component: () => import('layouts/MainLayout.vue'),
    name: 'edit',
    children: [
      { path: '', component: () => import('pages/CustomerEdit.vue'), props: true },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
