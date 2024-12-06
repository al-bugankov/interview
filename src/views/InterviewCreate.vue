<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { ERouteNames } from '@/router/ERouteNames'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'

const router = useRouter()
const interviewStore = useInterviewStore()
const feedbackStore = useFeedbackStore()
const isValidateStart = ref<boolean>(false)

const validateFields = () => {
  isValidateStart.value = true
  let hasError = false
  const fields = [
    { field: 'company', errorClass: 'company-error' },
    { field: 'vacancyLink', errorClass: 'vacancy-error' },
    { field: 'hrName', errorClass: 'hr-error' },
    { field: 'contactTelegram', errorClass: 'telegram-error' },
    { field: 'contactWhatsApp', errorClass: 'whatsapp-error' }
  ]

  fields.forEach(({ field, errorClass }) => {
    const fieldValue =
      interviewStore.currentInterview[field as keyof typeof interviewStore.currentInterview]
    const errorContainer = document.querySelector(`.${errorClass}`) as HTMLElement
    if (!fieldValue && errorContainer) {
      errorContainer.style.display = 'block'
      hasError = true
    }
  })
  if (!hasError) {
    addNewInterview()
  }
}

const addNewInterview = async (): Promise<void> => {
  feedbackStore.isGlobalLoading = true

  interviewStore.currentInterview.id = uuidv4()
  interviewStore.currentInterview.createdAt = new Date()

  if (userIdFromStorage()) {
    await interviewStore.addInterview()
    await router.push({ name: ERouteNames.INTERVIEW_LIST })
  }
  feedbackStore.isGlobalLoading = false
}

onUnmounted(() => {
  interviewStore.$reset()
})
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input-text
          v-model="interviewStore.currentInterview.company"
          :class="{
            invalid: isValidateStart && !interviewStore.currentInterview.company
          }"
          class="input company-input"
          placeholder="Компания *"
        />
        <p v-if="!interviewStore.currentInterview.company" class="error company-error">
          Поле обязательно для заполнения!
        </p>
        <div class="salary-inputs-container">
          <app-input-number
            v-model="interviewStore.currentInterview.salaryFrom"
            class="salary-input"
            placeholder="ЗП-от"
          />
          <app-input-number
            v-model="interviewStore.currentInterview.salaryTo"
            class="salary-input"
            placeholder="ЗП-до"
          />
        </div>
        <app-input-text
          v-model="interviewStore.currentInterview.vacancyLink"
          :class="{
            invalid: isValidateStart && !interviewStore.currentInterview.vacancyLink
          }"
          class="input vacancy-input"
          placeholder="Ссылка на вакансию *"
        />
        <p v-if="!interviewStore.currentInterview.vacancyLink" class="error vacancy-error">
          Поле обязательно для заполнения!
        </p>
        <app-input-text
          v-model="interviewStore.currentInterview.hrName"
          :class="{
            invalid: isValidateStart && !interviewStore.currentInterview.hrName
          }"
          class="input hr-input"
          placeholder="Имя HR *"
        />
        <p v-if="!interviewStore.currentInterview.hrName" class="error hr-error">
          Поле обязательно для заполнения!
        </p>
        <app-input-text
          v-model="interviewStore.currentInterview.contactTelegram"
          :class="{
            invalid:
              isValidateStart &&
              !interviewStore.currentInterview.contactTelegram &&
              !interviewStore.currentInterview.contactWhatsApp
          }"
          class="input telegram-input"
          placeholder="Telegram *"
        />
        <p
          v-if="
            !interviewStore.currentInterview.contactTelegram &&
            !interviewStore.currentInterview.contactWhatsApp
          "
          class="error telegram-error"
        >
          Одно из этих полей обязательно для заполнения!
        </p>
        <app-input-text
          v-model="interviewStore.currentInterview.contactWhatsApp"
          :class="{
            invalid:
              isValidateStart &&
              !interviewStore.currentInterview.contactTelegram &&
              !interviewStore.currentInterview.contactWhatsApp
          }"
          class="input whatsapp-input"
          placeholder="WhatsApp"
        />
        <p
          v-if="
            !interviewStore.currentInterview.contactTelegram &&
            !interviewStore.currentInterview.contactWhatsApp
          "
          class="error whatsapp-error"
        >
          Одно из этих полей обязательно для заполнения!
        </p>
        <app-input-text
          v-model="interviewStore.currentInterview.contactPhone"
          class="input"
          placeholder="Телефон"
        />
        <app-button
          :loading="feedbackStore.isGlobalLoading"
          class="add-button"
          label="Создать собеседование"
          style="--p-button-primary-border-color: transparent"
          @click="validateFields"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.input,
::v-deep(.p-inputnumber-input) {
  width: 100%;
  border-radius: var(--element-radius);
  font-family: var(--manrope-medium), sans-serif;
  font-size: 14px;
  margin-bottom: 12px;
}

::v-deep(.p-inputnumber) {
  width: 49%;
}

.salary-inputs-container {
  display: flex;
  justify-content: space-between;
}

.input::placeholder {
  font-family: var(--manrope-medium), sans-serif;
  font-size: 12px;
}

.content-interview {
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: var(--element-radius);
}

::v-deep(.p-card-title) {
  font-family: var(--manrope-bold), sans-serif;
  font-size: 16px;
}

::v-deep(.p-card-body) {
  padding: 12px;
}

.add-button {
  width: 100%;
  background-color: var(--inProgress-color);
  border-radius: var(--element-radius);
  font-family: var(--manrope-medium), sans-serif;
}

.add-button:hover,
.add-button:active {
  background-color: var(--inProgress-lighter) !important;
}

.error {
  display: none;
  height: 12px;
  font-family: var(--manrope-bold), sans-serif;
  font-size: 10px;
  color: var(--refusal-color);
  margin-top: -12px;
  margin-bottom: 8px;
  padding-left: 8px;
}

input.invalid {
  border: 1px solid var(--refusal-color);
}

:root {
  --p-emerald-500: transparent !important;
  --p-button-primary-border-color: transparent !important;
}
</style>
