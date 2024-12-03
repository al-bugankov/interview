<script lang="ts" setup>
import { onMounted } from 'vue'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import type { TResultFilter } from '@/modules/interview/types/TResultFilter'

const interviewStore = useInterviewStore()

const filterInterviewsList = async (filterValue: TResultFilter) => {
  //// TODO название переменной не соответствует содержимому, лучше назвать ее allInterviewsFilterButton
  //// ещё мне не понятно, как меняется класс active, на других кнопках фильтра (приглашение, отказ, ожидание), я потестил и он не меняется и они не как не подсвечиваются.
  //// Только в момент нажатия как псевдокласс :active. Но если нажать в другое место, то подсветка пропадает.
  const activeButton = document.getElementById('all-button')
  if (activeButton) {
    activeButton.classList.remove('active')
  }
  interviewStore.setFilterResult(filterValue) // Используем метод из interviewStore
  await interviewStore.getAllInterviews(true)
}

onMounted(() => {
  interviewStore.doActiveButton()
})
</script>

<template>
  <div class="filter-button-container">
    <button id="all-button" class="filter-button" type="button" @click="interviewStore.clearFilter">
      Все
    </button>
    <button
      id="offer-button"
      class="filter-button"
      type="button"
      @click="filterInterviewsList('Offer')"
    >
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

@media (prefers-color-scheme: dark) {
  .filter-button {
    background-color: var(--button-bkg-dark-theme);
  }
}
</style>
