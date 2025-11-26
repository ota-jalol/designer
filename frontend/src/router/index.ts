import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@modules/designer/pages/DesignerPage.vue'),
  },
  {
    path: '/designer/:projectId?',
    name: 'designer',
    component: () => import('@modules/designer/pages/DesignerPage.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@modules/designer/pages/ProjectsPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
