import { createRouter, createWebHashHistory } from "vue-router";
import { useUsers } from '@/stores/user'

import NProgress from "nprogress/nprogress.js";

// Main layouts
import LayoutBackend from "@/layouts/variations/BackendStarter.vue";
import LayoutSimple from "@/layouts/variations/Simple.vue";

const APP_NAME = import.meta.env.VITE_APP_NAME

// Backend: Dashboard
const Dashboard = () => import("@/views/starter/DashboardView.vue");

// Auth
const AuthSignIn = () => import("@/views/auth/SignInView.vue");
const AuthSignUp = () => import("@/views/auth/SignUpView.vue");
const AuthLock = () => import("@/views/auth/LockView.vue");
const AuthReminder = () => import("@/views/auth/ReminderView.vue");
const AuthTwoFactor = () => import("@/views/auth/TwoFactorView.vue");

// Errors
const PageNotFound = () => import("@/views/errors/404View.vue");

// Set all routes
const routes = [
  {
    path: '/',
    redirect: () => {
      return { name: 'auth-signin' }
    },
  },
  {
    path: "/auth",
    component: LayoutSimple,
    children: [
      {
        path: "signin",
        name: "auth-signin",
        component: AuthSignIn,
        query: {
          reset: 'reset',
        },
        meta: {
            title: 'Sign In',
            guard: 'guest',
        },
      },
      {
        path: "signup",
        name: "auth-signup",
        component: AuthSignUp,
      },
      {
        path: "lock",
        name: "auth-lock",
        component: AuthLock,
      },
      {
        path: "reminder",
        name: "auth-reminder",
        component: AuthReminder,
      },
      {
        path: "two-factor",
        name: "auth-two-factor",
        component: AuthTwoFactor,
      },
    ],
  },
  {
    path: "/backend",
    redirect: "/backend/dashboard",
    component: LayoutBackend,
    children: [
      {
        path: "dashboard",
        name: "backend-dashboard",
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          guard: 'auth',
        },
      },
    ],
  },
  {
    path: '/page-not-found',
    name: 'page-not-found',
    component: PageNotFound,
    meta: {
        title: 'Page Not Found',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/page-not-found',
  },
];

// Create Router
const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  NProgress.start();
  next();
});

router.beforeEach((to, from, next) => {
  const store = useUsers()

  const auth = store.authUser

  if (to.matched.some(route => route.meta.guard === 'guest') && auth)
      next({ name: 'dashboard' })
  else if (to.matched.some(route => route.meta.guard === 'auth') && !auth)
      next({ name: 'login' })
  else next()
})

// Page Title and Metadata

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
      .slice()
      .reverse()
      .find(r => r.meta && r.meta.title)

  const nearestWithMeta = to.matched
      .slice()
      .reverse()
      .find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) {
      document.title = nearestWithTitle.meta.title + ' - ' + APP_NAME
  } else {
      document.title = APP_NAME
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
      el => el.parentNode.removeChild(el),
  )

  if (!nearestWithMeta) return next()

  nearestWithMeta.meta.metaTags
      .map(tagDef => {
          const tag = document.createElement('meta')

          Object.keys(tagDef).forEach(key => {
              tag.setAttribute(key, tagDef[key])
          })

          tag.setAttribute('data-vue-router-controlled', '')

          return tag
      })

      .forEach(tag => document.head.appendChild(tag))

  next()
})

router.afterEach((to, from) => {
  NProgress.done();
});
/*eslint-enable no-unused-vars*/

export default router;
