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

defineExpose({
  filterBtnHandler
})

onMounted(() => {
  interviewStore.getAllInterviews()
})

onUnmounted(() => {
  interviewStore.$reset()
})
</script>

<template>
  <div class="filter-container">
    <button
      id="all-interview-button"
      :class="{ active: !interviewStore.selectedFilterResult }"
      class="filter-container__button"
      type="button"
      @click="filterBtnHandler('')"
    >
      Все
    </button>
    <button
      id="offer-button"
      :class="{ active: interviewStore.selectedFilterResult === 'Offer' }"
      class="filter-container__button"
      type="button"
      @click="filterBtnHandler('Offer')"
    >
      Приглашение
    </button>
    <button
      id="refusal-button"
      :class="{ active: interviewStore.selectedFilterResult === 'Refusal' }"
      class="filter-container__button"
      type="button"
      @click="filterBtnHandler('Refusal')"
    >
      Отказ
    </button>
    <button
      id="inProgress-button"
      :class="{ active: interviewStore.selectedFilterResult === 'inProgress' }"
      class="filter-container__button"
      type="button"
      @click="filterBtnHandler('inProgress')"
    >
      Ожидание
    </button>
  </div>
</template>

<style scoped>
.filter-container__button {
  height: 28px;
  border-radius: var(--element-radius);
  padding: 6px 8px;
  background-color: var(--background-color);
  border: none;
  margin-right: 6px;
  cursor: pointer;
  margin-bottom: 12px;
  font-family: var(--manrope-bold), sans-serif;
  font-size: 12px;
  color: var(--secondary-text-color);
}

.filter-container {
  padding-inline: 10px;
}

.filter-container__button:active,
.active,
.filter-container__button:focus-within {
  background-color: var(--active-background);
  color: white;
  cursor: pointer;
}
</style>
