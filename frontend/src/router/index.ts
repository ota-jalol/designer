import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@modules/designer/pages/AuthPage.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    redirect: '/projects',
  },
  {
    path: '/designer/:projectId?',
    name: 'designer',
    component: () => import('@modules/designer/pages/DesignerPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@modules/designer/pages/ProjectsPage.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/projects');
  } else {
    next();
  }
});

export default router;
