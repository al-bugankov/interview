<script setup lang="ts">
import {computed, ref} from 'vue';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {useRouter} from "vue-router";
import {useToast} from 'primevue/usetoast'



const toast = useToast()
const email = ref<string>('')
const password = ref<string>('')
const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const router = useRouter()

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}
const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'
})
const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Создайте сейчас' : 'Авторизуйтесь'
})
const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Вход' : 'Регистрация'
})
const submitForm = (): void => {
  if (isLogin.value) {
    signIn()
  } else {
    signUp()
  }
}
const signUp = async (): Promise<void> => {
  isLoading.value = true
  try {
    await createUserWithEmailAndPassword(getAuth(),email.value, password.value)
    router.push({name: 'Home'})
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000})
    }
  } finally {
    isLoading.value = false
  }
}

const signIn = async (): Promise<void> => {
  isLoading.value = true
  try {
    await signInWithEmailAndPassword(getAuth(),email.value, password.value)
    router.push({name: 'Home'})
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000})
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="content-container">
    <app-toast position="bottom-right"/>
    <div class="auth-container">
      <div class="auth-header-container">
        <div class="header-title">Добро пожаловать!</div>
        <div class="header-subtitle-container">
        <span class="header-subtitle"> {{ subtitleText }}</span>
        <a class="font-medium ml-2 cursor-pointer" @click="toggleAuth">
          {{ linkAccountText }}
        </a>
        </div>
      </div>

      <form @submit.prevent="submitForm">
        <label for="email" class="email-label">Email</label>
        <app-input-text v-model="email" id="email" type="email" class="form-input"/>

        <label for="password" class="password-label">Password</label>
        <app-input-text v-model="password" id="password" type="password" class="form-input"/>

        <app-button
          :label="submitButtonText"
          type="submit"
          icon="pi pi-user"
          :loading="isLoading"
          class="submit-button"
        />
      </form>
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

.header-title {
  text-align: center;
  font-family: var(--manrope-bold);
  font-size: 16px;
  margin-block: 12px;
}

.header-subtitle-container {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
  font-family: var(--manrope-medium);
  font-size: 14px;
}

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