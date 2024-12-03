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

//// TODO лучше перенести эту логику в onMounted, перед тем как получить интервью
interviewStore.setInterviewId(interviewId as string)

const validateInterview = async (): Promise<void> => {
  //// TODO все таки это проверка не на какую то пустую дату, а на то, что дата не указана. Лучше назвать переменную hasInterviewStagesWithoutDate
  const hasEmptyDate = interviewStore.currentInterview?.stages?.some((stage) => !stage.date)

  //// не очевидно выходит из функции если пользователь отменит действие, лучше использовать return
  if (hasEmptyDate) {
    console.log('hasEmptyDate')
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
        //// вот здесь мы добавляем действие, которое произойдет если пользователь нажмет отмена или закроен диалог. Консоли можно убрать, я добавил чтобы показать что происходит
        reject: () => {
          console.log('reject')
          return
        },
        onHide: () => {
          console.log('onHide')
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

  <div
    v-if="interviewStore.currentInterview && !feedbackStore.isGlobalLoading"
    class="class-interview"
  >
    <app-card>
      <template #title
        >Собеседование в компанию {{ interviewStore.currentInterview.company }}
      </template>
      <template #content>
        <label for="company">Компания</label>
        <app-input-text
          id="company"
          v-model="interviewStore.currentInterview.company"
          class="input"
        />

        <label for="vacancyLink">Описание Вакансии (ссылка)</label>
        <app-input-text
          id="vacancyLink"
          v-model="interviewStore.currentInterview.vacancyLink"
          class="input"
        />

        <label for="hrName">Контакт (имя)</label>
        <app-input-text
          id="hrName"
          v-model="interviewStore.currentInterview.hrName"
          class="input"
        />

        <label for="contactTelegram">Telegram username HR</label>
        <app-input-text
          id="contactTelegram"
          v-model="interviewStore.currentInterview.contactTelegram"
          class="input"
        />

        <label for="contactWhatsApp">WhatsApp</label>
        <app-input-text
          id="contactWhatsApp"
          v-model="interviewStore.currentInterview.contactWhatsApp"
          class="input"
        />

        <label for="contactPhone">Телефон HR</label>
        <app-input-text
          id="contactPhone"
          v-model="interviewStore.currentInterview.contactPhone"
          class="input"
        />

        <label for="salaryFrom">Зарплатная вилка от</label>
        <app-input-number
          id="salaryFrom"
          v-model="interviewStore.currentInterview.salaryFrom"
          class="input"
          placeholder="Зарплатная вилка от"
        />

        <label for="salaryTo">Зарплатная вилка до</label>
        <app-input-number
          id="salaryTo"
          v-model="interviewStore.currentInterview.salaryTo"
          class="input"
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
            class="interview-stage"
          >
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
              @click="interviewStore.removeStage(index)"
            />
          </div>
        </template>
        <div class="radio-container">
          <div class="radio-item refusal">
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
            <label class="radio-label" for="interviewResult1">Отказ</label>
          </div>
          <div class="radio-item offer">
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
            <label class="radio-label" for="interviewResult2">Оффер</label>
          </div>
          <div class="radio-item inProgress">
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
            <label class="radio-label" for="interviewResult3">Ожидание</label>
          </div>
        </div>
        <app-button
          class="save-button"
          icon="pi pi-save"
          label="Сохранить"
          @click="validateInterview"
        />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
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

.class-interview {
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

::v-deep(.p-button-info) {
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

::v-deep(.p-datepicker-panel) {
  border-radius: 20px;
}
</style>
