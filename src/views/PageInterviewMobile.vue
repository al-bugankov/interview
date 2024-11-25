<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { doc, getDoc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import type { IInterview, IStage } from '@/interfaces'
import { useRoute, useRouter } from 'vue-router'
import { ERouteNames } from '@/router/ERouteNames'

const db = getFirestore()
const userStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const interview = ref<IInterview>()

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }
    interview.value = data
  }
  isLoading.value = false
}
const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true

  try {
    // Сохраняем данные интервью
    await updateDoc(docref, { ...interview.value })

    // Получаем данные после обновления
    await getData()
  } catch (error) {
    console.error('Ошибка при сохранении:', error)
  } finally {
    isLoading.value = false

    // Переходим на страницу /list после выполнения всех асинхронных операций
    router.push({ name: ERouteNames.INTERVIEW_LIST }) // Нет необходимости ожидать этого
  }
}

const observeStyles = () => {
  const observer = new MutationObserver(() => {
    const datePickerPanel = document.querySelector('.p-datepicker-panel')
    if (datePickerPanel) {
      datePickerPanel.style.setProperty('--p-datepicker-panel-border-radius', '20px')
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

onMounted(async () => {
  // Вызов getData и observeStyles
  await getData()
  observeStyles()
})
</script>

<template>
  <app-progress v-if="isLoading" />
  <div v-else-if="interview?.id && !isLoading" class="class-interview">
    <app-card>
      <template #title>Собеседование в компанию {{ interview.company }}</template>
      <template #content>
        <label for="company">Компания</label>
        <app-input-text id="company" v-model="interview.company" class="input" />

        <label for="vacancyLink">Описание Вакансии (ссылка)</label>
        <app-input-text id="vacancyLink" v-model="interview.vacancyLink" class="input" />

        <label for="hrName">Контакт (имя)</label>
        <app-input-text id="hrName" v-model="interview.hrName" class="input" />

        <label for="contactTelegram">Telegram username HR</label>
        <app-input-text id="contactTelegram" v-model="interview.contactTelegram" class="input" />

        <label for="contactWhatsApp">WhatsApp</label>
        <app-input-text id="contactWhatsApp" v-model="interview.contactWhatsApp" class="input" />

        <label for="contactPhone">Телефон HR</label>
        <app-input-text id="contactPhone" v-model="interview.contactPhone" class="input" />

        <label for="salaryFrom">Зарплатная вилка от</label>
        <app-input-number
          id="salaryFrom"
          v-model="interview.salaryFrom"
          class="input"
          placeholder="Зарплатная вилка от"
        />

        <label for="salaryTo">Зарплатная вилка до</label>
        <app-input-number
          id="salaryTo"
          v-model="interview.salaryTo"
          class="input"
          placeholder="Зарплатная вилка до"
        />

        <app-button
          :style="{
            '--p-button-info-background': 'var(--inProgress-color)',
            '--p-button-info-active-background': 'var(--inProgress-darken)'
          }"
          icon="pi pi-plus"
          label="Добавить этап"
          severity="info"
          @click="addStage"
        />
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="datepicker-input-container">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text
                :id="`stage-name-${index}`"
                v-model="stage.name"
                class="datepicker-input"
              />
            </div>
            <div class="datepicker-input-container">
              <label :for="`stage-date-${index}`">Дата прохождения этапа</label>
              <app-calendar
                :id="`stage-date-${index}`"
                v-model="stage.date"
                class="datepicker-input"
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
                class=""
                rows="5"
              />
            </div>
            <app-button
              class="delete-button"
              label="Удалить этап"
              severity="danger"
              @click="removeStage"
            />
          </div>
        </template>
        <div class="radio-container">
          <div class="radio-item refusal">
            <app-radio
              id="interviewResult1"
              v-model="interview.result"
              :style="{
                '--p-radiobutton-checked-background': 'var(--refusal-color)',
                '--p-radiobutton-checked-hover-background': 'var(--refusal-color)',
                '--p-radiobutton-checked-hover-border-color': 'var(--refusal-color)'
              }"
              name="result"
              value="Refusal"
            />
            <label class="radio-label" for="interviewResult1">Отказ</label>
          </div>
          <div class="radio-item offer">
            <app-radio
              id="interviewResult2"
              v-model="interview.result"
              :style="{
                '--p-radiobutton-checked-background': 'var(--offer-color)',
                '--p-radiobutton-checked-hover-background': 'var(--offer-color)',
                '--p-radiobutton-checked-hover-border-color': 'var(--offer-color)'
              }"
              name="result"
              value="Offer"
            />
            <label class="radio-label" for="interviewResult2">Оффер</label>
          </div>
          <div class="radio-item inProgress">
            <app-radio
              id="interviewResult3"
              v-model="interview.result"
              :style="{
                '--p-radiobutton-checked-background': 'var(--inProgress-color)',
                '--p-radiobutton-checked-hover-background': 'var(--inProgress-color)',
                '--p-radiobutton-checked-hover-border-color': 'var(--inProgress-color)'
              }"
              checked
              name="result"
              value="inProgress"
            />
            <label class="radio-label" for="interviewResult3">Ожидание</label>
          </div>
        </div>
        <app-button
          class="save-button"
          icon="pi pi-save"
          label="Сохранить"
          @click="saveInterview"
        />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}

.input {
  width: 100%;
  margin-bottom: 12px;
}

.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.interview-stage .datepicker-input {
  width: 100%;
  margin-bottom: 12px;
}

.datepicker-custom {
  --p-datepicker-panel-border-radius: 20px !important;
}

.class-interview {
  font-family: var(--manrope-medium);
}

::v-deep .p-card-title {
  font-size: 16px;
  font-family: var(--manrope-bold);
}

::v-deep .p-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

::v-deep .p-card-content label {
  font-size: 14px;
}

::v-deep .p-inputtext {
  border-radius: var(--element-radius);
  font-size: 14px;
}

::v-deep .p-card-body {
  border-radius: var(--element-radius);
  height: auto;
}

::v-deep .p-button-info,
.save-button,
.delete-button {
  width: 100%;
  border-radius: var(--element-radius);
  margin-block: 5px;
}

.interview-stage {
  border-radius: var(--element-radius);
}

.delete-button {
  background-color: var(--refusal-color);
}

::v-deep .p-button-info {
  background-color: var(--inProgress-color);
}

.save-button {
  background-color: var(--offer-color);
}

.radio-container {
  display: flex;
  width: 100%;
  margin-block: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.radio-item {
  display: flex;
  align-items: center;
}

.radio-label {
  margin-left: 5px;
  margin-right: 5px;
}

::v-deep .p-datepicker-panel {
  border-radius: 20px;
}
</style>
