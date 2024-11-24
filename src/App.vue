<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useUserStore} from "@/stores/user";
import AppHeaderMobile from "@/components/AppHeaderMobile.vue";

const userStore = useUserStore()
const isLoading = ref<boolean>(true);

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<template>
  <app-progress class="flex justify-content-center align-content-center" style="height: 100vh;" v-if="isLoading"/>
  <div v-else class="app-container">
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
