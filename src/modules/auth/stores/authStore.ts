import { defineStore } from 'pinia'
import type { IAuthStoreState } from '@/modules/auth/types/IAuthStoreState'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { ERouteNames } from '@/router/ERouteNames'
import router from '@/router'

export const useAuthStore = defineStore('authStore', {
  state: (): IAuthStoreState => ({
    isAuth: false,
    userId: '',
    isUserCheked: false,
    isAuthTypeTelegram: false
  }),
  getters: {},
  actions: {
    async getCurrentUser(): Promise<void> {
      this.isUserCheked = false
      const auth = getAuth()

      return new Promise((resolve): void => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.isAuth = true
            this.userId = user.uid
            this.isUserCheked = true
          } else {
            this.isAuth = false
            this.isUserCheked = false
          }
          resolve() // Разрешаем промис после выполнения проверки
        })
      })
    },

    async signIn(email: string, password: string) {
      const isSuccessful = true
      const feedbackStore = useFeedbackStore()

      try {
        const result = await signInWithEmailAndPassword(getAuth(), email, password)
        if (result.user) {
          this.isAuth = true
          this.userId = result.user.uid
          this.saveUserIdInStorage()
          return isSuccessful
        }

        return !isSuccessful
      } catch (error: unknown) {
        if (error instanceof Error && !this.isAuthTypeTelegram) {
          feedbackStore.showToast({ type: 'error', title: 'Error', message: error.message })
        }
        return !isSuccessful
      }
    },

    async signUp(email: string, password: string) {
      const isSuccessful = true
      const feedbackStore = useFeedbackStore()

      try {
        const result = await createUserWithEmailAndPassword(getAuth(), email, password)
        if (result.user) {
          this.isAuth = true
          this.userId = result.user.uid
          this.saveUserIdInStorage()
          return isSuccessful
        }

        return !isSuccessful
      } catch (error: unknown) {
        if (error instanceof Error && !this.isAuthTypeTelegram) {
          feedbackStore.showToast({ type: 'error', title: 'Error', message: error.message })
        }

        return !isSuccessful
      }
    },

    async logout() {
      await signOut(getAuth())
      this.isAuth = false
      this.userId = ''
      sessionStorage.removeItem('userId')
      await router.push({ name: ERouteNames.AUTH_LOGIN })
    },

    saveUserIdInStorage() {
      sessionStorage.setItem('userId', this.userId)
    }
  }
})
