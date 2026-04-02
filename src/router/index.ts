import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '@/services/AuthService';

const routes = [
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/films',
    component: () => import('@/views/FilmsView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const needsAuth = to.meta.requiresAuth;
  const loggedIn = isLoggedIn();

  if (needsAuth && !loggedIn) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && loggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
