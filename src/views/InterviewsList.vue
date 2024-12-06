<script lang="ts" setup>
import { onMounted } from 'vue'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import { ERouteNames } from '@/router/ERouteNames'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { useRouter } from 'vue-router'
import InterviewsPageFilters from '@/modules/interview/components/InterviewsPageFilters.vue'
import CardItem from '@/modules/interview/components/CardItem.vue'

const interviewStore = useInterviewStore()
const feedbackStore = useFeedbackStore()
const router = useRouter()

onMounted(async () => {
  feedbackStore.isGlobalLoading = true
  await interviewStore.getAllInterviews()
  feedbackStore.isGlobalLoading = false
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

  <div class="main-content">
    <div class="header-container">
      <div class="header-text">
        <span>Мои собеседования</span>
      </div>
      <button class="add-button" type="button" @click="createInterview">
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

    <app-message v-if="!interviewStore.interviews.length" class="empty-list" severity="info">
      Нет добавленных собеседований
    </app-message>

    <div class="content-container">
      <card-item
        v-for="(interview, id) in interviewStore.interviews"
        :key="id"
        :interview="interview"
      />
    </div>
  </div>
</template>

<style scoped>
.main-content {
  height: auto;
}

.content-container {
  width: 100%;
}

.item-content span {
  margin-inline: 6px;
}

.header-text,
.add-button {
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

.header-container {
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin-bottom: 16px;
}

.status span {
  font-family: var(--manrope-medium), sans-serif;
}

.header-text {
  font-family: var(--manrope-bold), sans-serif;
  font-size: 16px;
}

.empty-list {
  font-family: var(--manrope-medium), sans-serif;
  font-size: 12px;
  margin-top: 15px;
}
</style>
