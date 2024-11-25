<script lang="ts" setup>
import { computed, ref } from 'vue'
import AuthFrom from '@/modules/auth/components/AuthFrom.vue'

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
</script>

<template>
  <div class="content-container">
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
</style>
