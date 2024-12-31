import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { ERouteNames } from '@/router/ERouteNames'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'

const checkAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (userIdFromStorage()) {
    await authStore.getCurrentUser()
    if (authStore.isUserCheked) {
      next()
    }
    return next({ name: ERouteNames.AUTH_LOGIN })
  }
  return next({ name: ERouteNames.AUTH_LOGIN })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ERouteNames.MAIN,
    beforeEnter: checkAuth,
    redirect: { name: ERouteNames.INTERVIEW_LIST },
    children: [
      {
        path: 'interview/create',
        name: ERouteNames.INTERVIEW_CREATE,
        component: () => import('@/views/InterviewCreate.vue')
      },
      {
        path: 'interview/:id',
        name: ERouteNames.INTERVIEW_ID,
        component: () => import('@/views/InterviewEdit.vue')
      },
      {
        path: 'list',
        name: ERouteNames.INTERVIEW_LIST,
        component: () => import('@/views/InterviewsList.vue')
      },
      {
        path: 'statistic',
        name: ERouteNames.STATISTIC,
        component: () => import('@/views/PageStatistic.vue')
      }
    ]
  },
  {
    path: '/auth',
    name: ERouteNames.AUTH,
    redirect: { name: ERouteNames.AUTH_LOGIN },
    children: [
      {
        path: 'login',
        name: ERouteNames.AUTH_LOGIN,
        component: () => import('@/views/AuthLogin.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: ERouteNames.NOT_FOUND,
    component: () => import('@/views/PageNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
