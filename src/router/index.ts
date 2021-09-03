import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   component: () => import('@view/Index.vue'),
  // },
  {
    path: '/',
    name: 'NewDesign',
    component: () => import('@view/NewDesign.vue'),
  },
  {
    path: '/collections',
    name: 'Collections',
    component: () => import('@view/Collections.vue'),
  },
  {
    path: '/congratulations',
    name: 'Congratulations',
    component: () => import('@view/Congratulations.vue'),
  },
  {
    path: '/more',
    name: 'ReadMore',
    component: () => import('@view/ReadMore.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
