<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ERouteNames } from '@/router/ERouteNames'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isUserAlreadyExist: boolean
}>()

const authStore = useAuthStore()
const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
const isBtnLoading = ref<boolean>(false)

const submitButtonText = computed<string>(() => {
  return props.isUserAlreadyExist ? 'Вход' : 'Регистрация'
})

const submitForm = async () => {
  isBtnLoading.value = true
  if (props.isUserAlreadyExist) {
    const isUserSuccessfullyLogin = await authStore.signIn(email.value, password.value)
    if (!isUserSuccessfullyLogin) {
      isBtnLoading.value = false
      return
    }

    isBtnLoading.value = false
    await router.push({ name: ERouteNames.INTERVIEW_LIST })
    return
  }

  const isUserSuccessfullyCreate = await authStore.signUp(email.value, password.value)
  if (!isUserSuccessfullyCreate) {
    isBtnLoading.value = false
    return
  }
  isBtnLoading.value = false
  await router.push({ name: ERouteNames.INTERVIEW_LIST })
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <label class="email-label" for="email">Email</label>
    <app-input-text id="email" v-model="email" class="form-input" type="email" />

    <label class="password-label" for="password">Password</label>
    <app-input-text id="password" v-model="password" class="form-input" type="password" />

    <app-button
      :label="submitButtonText"
      :loading="isBtnLoading"
      class="submit-button"
      icon="pi pi-user"
      type="submit"
    />
  </form>
</template>

<style scoped>
form {
  padding-inline: 10px;
  font-family: var(--manrope-medium);
  font-size: 14px;
}

.form-input {
  width: 100%;
}

.submit-button {
  width: 100%;
  margin-block: 15px;
  background-color: var(--inProgress-color);
  border-radius: var(--element-radius);
  font-family: var(--manrope-medium);
}

.submit-button:hover,
.submit-button:active {
  background-color: var(--inProgress-darken) !important;
}
</style>
