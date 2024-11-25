<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import AppHeaderMobile from '@/modules/navigation/components/NavigationBar.vue'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import router from '@/router'
import ToastMessage from '@/modules/feedback/components/ToastMessage.vue'

const authStore = useAuthStore()
const feedbackStore = useFeedbackStore()

const isAuthRoute = computed(() => {
  return router.currentRoute
})

onMounted(() => {
  // onAuthStateChanged(getAuth(), (user) => {
  //   if (user) {
  //     authStore.userId = user.uid
  //   } else {
  //     authStore.userId = ''
  //   }
  //   feedbackStore.isGlobalLoading = false
  // })
})
</script>

<template>
  <app-progress
    v-if="feedbackStore.isGlobalLoading"
    class="flex justify-content-center align-content-center"
    style="height: 100vh"
  />
  <toast-message />

  <div class="app-container">
    <div class="header-container">
      <AppHeaderMobile />
    </div>
    <div class="content-container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-container,
.content-container {
  width: 100%;
  max-width: 375px;
  min-width: 315px;
  padding-inline: 15px;
}

.content-container {
  margin-bottom: 30px;
}
</style>
