<script lang="ts" setup>
import { onMounted } from 'vue'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import { ERouteNames } from '@/router/ERouteNames'
import { useRouter } from 'vue-router'
import InterviewsPageFilters from '@/modules/interview/components/InterviewsPageFilters.vue'
import CardItem from '@/modules/interview/components/CardItem.vue'

const interviewStore = useInterviewStore()
const router = useRouter()

onMounted(async () => {
  await interviewStore.getAllInterviews()
})

const createInterview = () => {
  router.push({ name: ERouteNames.INTERVIEW_CREATE })
}
</script>

<template>
  <app-confirm-dialog
    :style="{
      width: '270px',
      height: '215px',
      fontFamily: 'var(--manrope-medium)',
      fontSize: '14px'
    }"
  />

  <div class="interview-list">
    <div class="interview-list__header">
      <div class="interview-list__header-text">
        <span>Мои собеседования</span>
      </div>
      <button class="interview-list__header-add-button" type="button" @click="createInterview">
        <img
          alt="add interview icon"
          height="34"
          loading="lazy"
          src="@/assets/icon/Add.svg"
          width="34"
        />
      </button>
    </div>

    <interviews-page-filters />

    <app-message
      v-if="!interviewStore.interviews.length"
      class="interview-list--empty"
      severity="info"
    >
      Нет добавленных собеседований
    </app-message>

    <div class="interview-list__content">
      <card-item
        v-for="(interview, id) in interviewStore.interviews"
        :key="id"
        :interview="interview"
      />
    </div>
  </div>
</template>

<style scoped>
.interview-list {
  height: auto;
}

.interview-list__content {
  width: 100%;
}

.item-content span {
  margin-inline: 6px;
}

.interview-list__header-text,
.interview-list__header-add-button {
  font-family: var(--manrope-bold), sans-serif;
  font-size: 16px !important;
  display: flex;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  touch-action: manipulation;
  border: none;
  background-color: transparent;
}

.interview-list__header-text span {
  color: var(--primary-text-color);
}

.interview-list__header {
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin-bottom: 16px;
}

.interview-list--empty {
  font-family: var(--manrope-medium), sans-serif;
  font-size: 12px;
  margin-top: 15px;
}
</style>
