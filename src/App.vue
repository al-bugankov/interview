<script lang="ts" setup>
import NavigationBar from '@/modules/navigation/components/NavigationBar.vue'
import ToastMessage from '@/modules/feedback/components/ToastMessage.vue'
import LoaderOverlay from '@/modules/overlay/components/LoaderOverlay.vue'


</script>

<template>
  <toast-message />

  <div class="app-container">
 <loader-overlay />
    <div class="header-container">
      <navigation-bar />
    </div>
    <div class="content-container">

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
  position: relative
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
