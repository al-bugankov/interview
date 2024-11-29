<script setup lang="ts">
import { onMounted } from 'vue'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'

import type { TResultFilter } from '@/interfaces'

const interviewStore = useInterviewStore()

const filterInterviewsList = async (filterValue: TResultFilter) => {
  const activeButton = document.getElementById('all-button')
  if (activeButton) {
    activeButton.classList.remove('active')
  }
  interviewStore.setFilterResult(filterValue) // Используем метод из interviewStore
  await interviewStore.getAllInterviews(true)
}

// Метод для сброса фильтра
const clearFilter = async () => {
  interviewStore.setFilterResult('') // Очищаем фильтр
  await interviewStore.getAllInterviews()
}

onMounted(() => {
  const activeButton = document.getElementById('all-button');
  if (activeButton) {
    activeButton.classList.add('active');
  }
});
</script>

<template>
  <div class="filter-button-container">
    <button id="all-button" class="filter-button" type="button" @click="clearFilter">Все</button>
    <button id="offer-button" class="filter-button" type="button" @click="filterInterviewsList('Offer')">
      Приглашение
    </button>
    <button
      id="refusal-button"
      class="filter-button"
      type="button"
      @click="filterInterviewsList('Refusal')"
    >
      Отказ
    </button>
    <button
      id="inProgress-button"
      class="filter-button"
      type="button"
      @click="filterInterviewsList('inProgress')"
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
</style>