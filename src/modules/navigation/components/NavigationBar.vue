<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { computed, ref } from 'vue'
import { ERouteNames } from '@/router/ERouteNames'

const authStore = useAuthStore()

const navigationItems = ref([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: { name: ERouteNames.AUTH_LOGIN },
    show: computed((): boolean => !authStore.userId),
  },
  {
    label: 'Мои собеседования',
    icon: 'pi pi-list',
    path: { name: ERouteNames.INTERVIEW_LIST },
    show: computed((): boolean => !!authStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: { name: ERouteNames.STATISTIC },
    show: computed((): boolean => !!authStore.userId),
  }
])

const visibleNavigationItems = computed(() =>
  navigationItems.value.filter(item => item.show)
);
</script>

<template>
  <div class="nav-container">
    <app-menubar :model="visibleNavigationItems" class="menu">
      <template #item="{ item, props }">
        <template v-if="item.show">
          <router-link :to="item.path" v-bind="props.action">
            <span :class="item.icon" class="p-menuitem-icon" />
            <span> {{ item.label }} </span>
          </router-link>
        </template>
      </template>
      <template #end>
        <span v-if="authStore.isAuth" class="menu-exit" @click="authStore.logout">
          <span class="pi pi-sign-out p-menuitem-icon" />
          <span>Выход</span>
        </span>
      </template>
    </app-menubar>
  </div>
</template>

<style scoped>
.menu {
  width: 100%;
  margin-block: 30px;
  border-radius: var(--element-radius);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-container {
  width: 100%;
}

.menu-exit {
  cursor: pointer;
}

::v-deep(.p-menubar-root-list) {
  width: 80%;
  display: flex;
  gap: 0;
}

::v-deep(.p-menubar-root-list) {
  border-radius: var(--element-radius);
}

::v-deep(.p-menubar-button[aria-expanded='true'] .p-icon) {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

::v-deep(.p-menubar-button[aria-expanded='false'] .p-icon) {
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

::v-deep(.p-menubar-item-content) {
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep(.p-menubar-end) {
  width: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep(.p-menubar-end:hover),
::v-deep(.p-menubar-end:active) {
  background-color: lightskyblue;
  border-radius: var(--element-radius);
}

::v-deep(.p-menubar-item-content),
::v-deep(.p-menubar-end) {
  font-size: 12px;
  font-family: var(--manrope-medium), sans-serif;
}

::v-deep(.p-menubar-end) {
  font-family: var(--manrope-bold), sans-serif;
  margin: 0;
}

::v-deep(.p-menubar-item-content .p-menubar-item-link) {
  gap: 3px;
}

::v-deep(.p-menubar-root-list .p-menubar-item .p-menubar-item-content .p-menubar-item-link) {
  padding: 0;
  margin-right: 5px;
}

::v-deep(.p-menubar-item-content .pi),
::v-deep(.p-menubar-end .pi) {
  font-size: 10px;
}

::v-deep(.p-menubar-end .pi) {
  margin-right: 3px;
  padding-top: 3px;
}

::v-deep(.p-menubar-item:nth-child(1)) {
  width: 150px;
}

::v-deep(.p-menubar-item:nth-child(2)) {
  width: 95px;
}

::v-deep(.p-menubar-item:nth-child(2):hover),
::v-deep(.p-menubar-item:nth-child(2):active) {
   width: 95px;
   background-color: lightskyblue;
   border-radius: var(--element-radius);
}

::v-deep(.p-menubar-item:nth-child(1):hover),
::v-deep(.p-menubar-item:nth-child(1):active){
  width: 150px;
  background-color: lightskyblue;
  border-radius: var(--element-radius);
}

::v-deep(.p-menubar-item:not(.p-disabled) .p-menubar-item-content:hover),
::v-deep(.p-menubar-item:not(.p-disabled) .p-menubar-item-content:active) {
  background-color: lightskyblue;
  border-radius: var(--element-radius);
}

::v-deep(.p-menubar-mobile) {
  display: flex;
  justify-content: space-between;
}

::v-deep(.p-menubar-mobile .p-menubar-item:hover),
::v-deep(.p-menubar-mobile .p-menubar-item:active) {
  background-color: lightskyblue;
  border-radius: var(--element-radius);
}

::v-deep(.p-menubar-mobile .p-menubar-item:focus),
::v-deep(.p-menubar-mobile .p-menubar-item:focus-within) {
  background-color: transparent;
}

::v-deep(.p-menubar-item.p-focus .p-menubar-item-content) {
  background-color: transparent;
}

::v-deep(.p-menubar-mobile .p-menubar-root-list .p-menubar-item:active),
::v-deep(.p-menubar-mobile .p-menubar-root-list .p-menubar-item:hover) {
  width: 100%;
  background-color: lightskyblue;
  border-radius: var(--element-radius);
}


</style>
