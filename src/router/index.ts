import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@view/Index.vue'),
  },
  {
    path: '/new-design',
    name: 'NewDesign',
    component: () => import('@view/NewDesign.vue'),
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
