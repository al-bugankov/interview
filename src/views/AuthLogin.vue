<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import AuthFrom from '@/modules/auth/components/AuthFrom.vue'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { ERouteNames } from '@/router/ERouteNames'
import { useRouter } from 'vue-router'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'

import type { IUserTelegramType } from '@/modules/auth/types/IUserTelegramType'

const authStore = useAuthStore()
const feedbackStore = useFeedbackStore()
const router = useRouter()

const userTelegram = ref<IUserTelegramType | null>(null)

const isUserAlreadyExist = ref<boolean>(true)

const toggleAuth = () => {
  isUserAlreadyExist.value = !isUserAlreadyExist.value
}

const subtitleText = computed<string>(() => {
  return isUserAlreadyExist.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'
})

const linkAccountText = computed<string>(() => {
  return isUserAlreadyExist.value ? 'Создайте сейчас' : 'Авторизуйтесь'
})

const loginOrRigister = async (user: IUserTelegramType) => {
  const userLogin = `${user.id}@gmail.com`
  const userPassword = 'commonPassword2024'

  const isUserSuccessfullyLogin = await authStore.signIn(userLogin, userPassword)
  if (!isUserSuccessfullyLogin) {
    const isUserSuccessfullyCreate = await authStore.signUp(userLogin, userPassword)
    if (!isUserSuccessfullyCreate) {
      return
    }
  }
  await router.push({ name: ERouteNames.INTERVIEW_LIST })
  feedbackStore.isGlobalLoading = false
  return
}

onMounted(() => {
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp
    const initData = webApp.initData

    if (initData) {
      feedbackStore.isGlobalLoading = true
      authStore.isAuthTypeTelegram = true
      const decodedData = decodeURIComponent(initData)
      const userDataMatch = decodedData.match(/user=({.*?})/)
      userTelegram.value = userDataMatch ? JSON.parse(userDataMatch[1]) : null
      if (userTelegram.value) {
        loginOrRigister(userTelegram.value)
      }
    }
  }
})
</script>

<template>
  <div v-if="!authStore.isAuthTypeTelegram" class="content-container">
    <div class="auth-container">
      <div class="auth-container__header">
        <div class="auth-container__header-title">Привет!</div>
        <div class="auth-container__header-subtitle">
          <div v-if="!authStore.isAuthTypeTelegram" class="auth-container__email-toggle">
            <span class="auth-container__email-toggle-subtitle"> {{ subtitleText }}</span>
            <a class="font-medium ml-2 cursor-pointer" @click="toggleAuth">
              {{ linkAccountText }}
            </a>
          </div>
        </div>
      </div>

      <auth-from :is-user-already-exist="isUserAlreadyExist" />
    </div>
  </div>
</template>

<style scoped>
a {
  color: var(--inProgress-color);
  cursor: pointer;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
}

.auth-container {
  height: auto;
  border: 1px solid var(--card-border);
  border-radius: var(--element-radius);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.auth-container__header-title {
  text-align: center;
  font-family: var(--manrope-bold), sans-serif;
  font-size: 16px;
  margin-block: 12px;
  color: var(--primary-text-color);
}

.auth-container__header-subtitle {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  font-family: var(--manrope-medium), sans-serif;
  font-size: 14px;
}

label {
  margin-top: 3px;
}

.auth-container__email-toggle {
  text-align: center;
}

.auth-container__email-toggle-subtitle {
  color: var(--primary-text-color);
}
</style>
