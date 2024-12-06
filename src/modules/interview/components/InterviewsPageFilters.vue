<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import type { TResultFilter } from '@/modules/interview/types/TResultFilter'

const interviewStore = useInterviewStore()

const filterBtnHandler = async (filterValue: TResultFilter) => {
  if (filterValue) {
    interviewStore.setFilterResult(filterValue)
    await interviewStore.getAllInterviews(true)
    return
  }
  interviewStore.clearFilter()
  await interviewStore.getAllInterviews()
}

onMounted(() => {
  interviewStore.getAllInterviews()
})

onUnmounted(() => {
  interviewStore.$reset()
})
</script>

<template>
  <div class="filter-button-container">
    <button
      id="all-interview-button"
      :class="{ active: !interviewStore.selectedFilterResult }"
      class="filter-button"
      type="button"
      @click="filterBtnHandler('')"
    >
      Все
    </button>
    <button
      id="offer-button"
      :class="{ active: interviewStore.selectedFilterResult === 'Offer' }"
      class="filter-button"
      type="button"
      @click="filterBtnHandler('Offer')"
    >
      Приглашение
    </button>
    <button
      id="refusal-button"
      :class="{ active: interviewStore.selectedFilterResult === 'Refusal' }"
      class="filter-button"
      type="button"
      @click="filterBtnHandler('Refusal')"
    >
      Отказ
    </button>
    <button
      id="inProgress-button"
      :class="{ active: interviewStore.selectedFilterResult === 'inProgress' }"
      class="filter-button"
      type="button"
      @click="filterBtnHandler('inProgress')"
    >
      Ожидание
    </button>
  </div>
</template>

<style scoped>
.filter-button {
  height: 28px;
  border-radius: var(--element-radius);
  padding: 6px 8px;
  background-color: #d4d4d4;
  border: none;
  margin-right: 6px;
  cursor: pointer;
  margin-bottom: 12px;
  font-family: var(--manrope-bold), sans-serif;
  font-size: 12px;
}

.filter-button-container,
.header-container {
  padding-inline: 10px;
}

.filter-button:active,
.active,
.filter-button:focus-within {
  background-color: var(--active-background);
  color: white;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .filter-button {
    background-color: var(--button-bkg-dark-theme);
  }
}
</style>
