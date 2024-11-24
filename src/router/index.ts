import { createRouter, createWebHistory } from 'vue-router'
import type {RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import {getAuth, onAuthStateChanged} from "firebase/auth";

const checkAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  let isAuth = false

  onAuthStateChanged(getAuth(), (user) => {
    if (user && !isAuth) {
      isAuth = true
      next()
    } else if (!user && !isAuth) {
      isAuth = true
      next('/auth')
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/PageHomeMobile.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/PageAuthMobile.vue')
  },
  {
    path: '/interview/:id',
    name: 'Interview',
    component: () => import('@/views/PageInterviewMobile.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/PageListMobile.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/statistic',
    name: 'Statistic',
    component: () => import('@/views/PageStatistic.vue'),
    beforeEnter: checkAuth
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router