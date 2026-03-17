import { createRouter, createWebHistory } from 'vue-router';
const LoginPage = () => import('../views/LoginPage.vue');
const RegisterPage = () => import('../views/RegisterPage.vue').catch(() => {
  console.warn('找不到模块“../views/RegisterPage.vue”，将返回空组件');
  return { template: '<div>组件加载失败</div>' };
});
const KamiGeneratePage = () => import('../views/KamiGeneratePage.vue');
const KamiListPage = () => import('../views/KamiListPage.vue');
const AdminDashboardPage = () => import('../views/AdminDashboardPage.vue');
const AdminUserManagementPage = () => import('../views/AdminUserManagementPage.vue');
const AdminLoginLogsPage = () => import('../views/AdminLoginLogsPage.vue');
const AdminKamiManagementPage = () => import('../views/AdminKamiManagementPage.vue');
const ChangePasswordPage = () => import('../views/ChangePasswordPage.vue');

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/kami/generate',
    name: 'KamiGenerate',
    component: KamiGeneratePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/kami/list',
    name: 'KamiList',
    component: KamiListPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUserManagement',
    component: AdminUserManagementPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/login-logs',
    name: 'AdminLoginLogs',
    component: AdminLoginLogsPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/all-kamis',
    name: 'AdminKamiManagement',
    component: AdminKamiManagementPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePasswordPage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresAdmin && (!user || !user.is_admin)) {
    next('/kami/generate');
  } else {
    next();
  }
});

export default router;