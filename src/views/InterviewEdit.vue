<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ERouteNames } from '@/router/ERouteNames'
import { useConfirm } from 'primevue/useconfirm'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'

const route = useRoute()
const router = useRouter()
const confirm = useConfirm()
const feedbackStore = useFeedbackStore()
const interviewStore = useInterviewStore()
const interviewId = route.params.id as string

const validateInterview = async (): Promise<void> => {
  const hasInterviewStagesWithoutDate = interviewStore.currentInterview?.stages?.some(
    (stage) => !stage.date
  )

  //// не очевидно выходит из функции если пользователь отменит действие, лучше использовать return
  if (hasInterviewStagesWithoutDate) {
    await new Promise<void>((resolve) => {
      confirm.require({
        message: 'Этап без указанной даты не будет сохранен!',
        header: 'Сохранение изменений',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Отмена',
        acceptLabel: 'Продолжить',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
          resolve()
        },
        reject: () => {
          return
        },
        onHide: () => {
          return
        }
      })
    })
  }

  interviewStore.currentInterview.stages = interviewStore.currentInterview?.stages?.filter(
    (stage) => stage.date
  )

  await interviewStore.updateInterview()
  await router.push({ name: ERouteNames.INTERVIEW_LIST })
}

onMounted(async () => {
  interviewStore.setInterviewId(interviewId as string)
  await interviewStore.getInterview()
})
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

  <div v-if="interviewStore.currentInterview && !feedbackStore.isGlobalLoading" class="interview">
    <app-card>
      <template #title>
        Собеседование в компанию {{ interviewStore.currentInterview.company }}
      </template>
      <template #content>
        <label for="company">Компания</label>
        <app-input-text
          id="company"
          v-model="interviewStore.currentInterview.company"
          class="interview__input"
        />

        <label for="vacancyLink">Описание Вакансии (ссылка)</label>
        <app-input-text
          id="vacancyLink"
          v-model="interviewStore.currentInterview.vacancyLink"
          class="interview__input"
        />

        <label for="hrName">Контакт (имя)</label>
        <app-input-text
          id="hrName"
          v-model="interviewStore.currentInterview.hrName"
          class="interview__input"
        />

        <label for="contactTelegram">Telegram username HR</label>
        <app-input-text
          id="contactTelegram"
          v-model="interviewStore.currentInterview.contactTelegram"
          class="interview__input"
        />

        <label for="contactWhatsApp">WhatsApp</label>
        <app-input-text
          id="contactWhatsApp"
          v-model="interviewStore.currentInterview.contactWhatsApp"
          class="interview__input"
        />

        <label for="contactPhone">Телефон HR</label>
        <app-input-text
          id="contactPhone"
          v-model="interviewStore.currentInterview.contactPhone"
          class="interview__input"
        />

        <label for="salaryFrom">Зарплатная вилка от</label>
        <app-input-number
          id="salaryFrom"
          v-model="interviewStore.currentInterview.salaryFrom"
          class="interview__input"
          placeholder="Зарплатная вилка от"
        />

        <label for="salaryTo">Зарплатная вилка до</label>
        <app-input-number
          id="salaryTo"
          v-model="interviewStore.currentInterview.salaryTo"
          class="interview__input"
          placeholder="Зарплатная вилка до"
        />

        <app-button
          :style="{
            '--p-button-info-background': 'var(--inProgress-color)',
            '--p-button-info-active-background': 'var(--inProgress-lighter)'
          }"
          icon="pi pi-plus"
          label="Добавить этап"
          severity="info"
          @click="interviewStore.addStage"
        />
        <template v-if="interviewStore.currentInterview.stages">
          <div
            v-for="(stage, index) in interviewStore.currentInterview.stages"
            :key="index"
            class="interview__stage"
          >
            <div class="interview__stage__datepicker-container">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text
                :id="`stage-name-${index}`"
                v-model="stage.name"
                class="interview__stage-datepicker"
              />
            </div>
            <div class="interview__stage__datepicker-container">
              <label :for="`stage-date-${index}`">Дата прохождения этапа</label>
              <app-calendar
                :id="`stage-date-${index}`"
                v-model="stage.date"
                class="interview__stage-datepicker"
                dateFormat="dd.mm.yy"
                panelClass="datepicker-custom"
              />
            </div>
            <div class="">
              <label :for="`stage-description-${index}`">Комментарий</label>
              <app-textarea
                :id="`stage-description-${index}`"
                v-model="stage.description"
                :style="{ borderRadius: 'var(--element-radius)', width: '100%' }"
                rows="5"
              />
            </div>
            <app-button
              class="interview__stage__delete-button"
              icon="pi pi-times"
              label="Удалить этап"
              severity="danger"
              @click="interviewStore.removeStage(index)"
            />
          </div>
        </template>
        <div class="interview__stage__radio-container">
          <div
            class="interview__stage__radio-container-item interview__stage__radio-container-item--refusal"
          >
            <app-radio
              id="interviewResult1"
              v-model="interviewStore.currentInterview.result"
              :style="{
                '--p-radiobutton-checked-background': 'var(--refusal-color)',
                '--p-radiobutton-checked-hover-background': 'var(--refusal-color)',
                '--p-radiobutton-checked-hover-border-color': 'var(--refusal-color)'
              }"
              name="result"
              value="Refusal"
            />
            <label class="interview__stage__radio-container-item-label" for="interviewResult1"
              >Отказ</label
            >
          </div>
          <div
            class="interview__stage__radio-container-item interview__stage__radio-container-item--offer"
          >
            <app-radio
              id="interviewResult2"
              v-model="interviewStore.currentInterview.result"
              :style="{
                '--p-radiobutton-checked-background': 'var(--offer-color)',
                '--p-radiobutton-checked-hover-background': 'var(--offer-color)',
                '--p-radiobutton-checked-hover-border-color': 'var(--offer-color)'
              }"
              name="result"
              value="Offer"
            />
            <label class="interview__stage__radio-container-item-label" for="interviewResult2"
              >Оффер</label
            >
          </div>
          <div
            class="interview__stage__radio-container-item interview__stage__radio-container-item--in-progress"
          >
            <app-radio
              id="interviewResult3"
              v-model="interviewStore.currentInterview.result"
              :style="{
                '--p-radiobutton-checked-background': 'var(--inProgress-color)',
                '--p-radiobutton-checked-hover-background': 'var(--inProgress-color)',
                '--p-radiobutton-checked-hover-border-color': 'var(--inProgress-color)'
              }"
              checked
              name="result"
              value="inProgress"
            />
            <label class="interview__stage__radio-container-item-label" for="interviewResult3"
              >Ожидание</label
            >
          </div>
        </div>
        <app-button
          class="interview__stage__save-button"
          icon="pi pi-save"
          label="Сохранить"
          @click="validateInterview"
        />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.interview__input {
  width: 100%;
  margin-bottom: 12px;
}

.interview__stage {
  border: 1px solid #ccc;
  border-radius: var(--element-radius);
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.interview__stage .interview__stage-datepicker {
  width: 100%;
  margin-bottom: 12px;
}

.interview {
  font-family: var(--manrope-medium), sans-serif;
}

::v-deep(.p-card-title) {
  font-size: 16px;
  font-family: var(--manrope-bold), sans-serif;
}

::v-deep(.p-card) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

::v-deep(.p-card-content label) {
  font-size: 14px;
}

::v-deep(.p-inputtext) {
  border-radius: var(--element-radius);
  font-size: 14px;
}

::v-deep(.p-card-body) {
  border-radius: var(--element-radius);
  height: auto;
}

::v-deep(.p-button-info),
.interview__stage__save-button,
.interview__stage__delete-button {
  width: 100%;
  border-radius: var(--element-radius);
  margin-block: 5px;
}

.interview__stage__delete-button {
  background-color: var(--refusal-color);
}

::v-deep(.p-button-info) {
  background-color: var(--inProgress-color);
}

.interview__stage__save-button {
  background-color: var(--offer-color);
}

.interview__stage__radio-container {
  display: flex;
  width: 100%;
  margin-block: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.interview__stage__radio-container-item {
  display: flex;
  align-items: center;
}

.interview__stage__radio-container-item-label {
  margin-left: 5px;
  margin-right: 5px;
}

::v-deep(.p-datepicker-panel) {
  border-radius: 20px;
}
</style>
