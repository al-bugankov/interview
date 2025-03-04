<script lang="ts" setup>
import NavigationBar from '@/modules/navigation/components/NavigationBar.vue'
import ToastMessage from '@/modules/feedback/components/ToastMessage.vue'
import LoaderOverlay from '@/modules/feedback/components/LoaderOverlay.vue'
import { onMounted } from 'vue'

onMounted(() => {
  document.addEventListener('touchend', (event: TouchEvent) => {
    const target = event.target as HTMLElement | null
    if (target && !target.closest('input, textarea')) {
      document
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
        .forEach((input) => input.blur())
    }
  })
})
</script>

<template>
  <toast-message />

  <div class="app-container">
    <loader-overlay />
    <div class="app-container__header">
      <navigation-bar />
    </div>
    <div class="app-container__content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.app-container__header,
.app-container__content {
  width: 100%;
  max-width: 375px;
  min-width: 315px;
  padding-inline: 15px;
}

.app-container__content {
  margin-bottom: 30px;
}
</style>
