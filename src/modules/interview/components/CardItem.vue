<script lang="ts" setup>
import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import { useConfirm } from 'primevue/useconfirm'
import { ERouteNames } from '@/router/ERouteNames'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utyls/formatDate'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import type { IInterview } from '@/modules/interview/types/IInterview'

//// было
// defineProps(['interview', 'id'])

//// пропсы лучше объявлять немного другим способом, чтобы сразу их типизировать
//// ещё интересно, что в этом файле не используется пропс id, возможно его можно удалить.
defineProps<{
  interview: IInterview
}>()

const router = useRouter()
const confirm = useConfirm()
const interviewStore = useInterviewStore()
const feedbackStore = useFeedbackStore()
const db = getFirestore()

//// TODO название функции не соответствует ее функционалу, лучше назвать ее openVacancyLink
const formattedVacancyLink = (link: string) => {
  const formattedlink = link.trim() // Убираем лишние пробелы
  // Проверяем, начинается ли ссылка с http или https
  const url = /^https?:\/\//.test(formattedlink) ? formattedlink : `https://${formattedlink}`
  // Открываем ссылку в новой вкладке
  window.open(url, '_blank', 'noopener,noreferrer')
}

//// TODO я бы назвал функцию goToEditInterview
const editInterview = (id: string) => {
  router.push({
    name: ERouteNames.INTERVIEW_ID,
    params: { id }
  })
}

//// было
// const confirmRemoveInterview = async (id: string): Promise<void> => {
//   confirm.require({
//     message: 'Вы хотите удалить собеседование?',
//     header: 'Удаление собеседования',
//     icon: 'pi pi-info-circle',
//     rejectLabel: 'Отмена',
//     acceptLabel: 'Удалить',
//     rejectClass: 'p-button-secondary p-button-outlined',
//     acceptClass: 'p-button-danger',
//     accept: async () => {
//       feedbackStore.isGlobalLoading = true
//       await deleteDoc(doc(db, `users/${userIdFromStorage()}/interviews`, id))
//       await interviewStore.getAllInterviews()
//       feedbackStore.isGlobalLoading = false
//     }
//   })
// }

//// было бы хорошо разделить это на 2 функции, одна для открытия диалога, другая для удаления

const deleteInterview = async (id: string): Promise<void> => {
  feedbackStore.isGlobalLoading = true
  await deleteDoc(doc(db, `users/${userIdFromStorage()}/interviews`, id))
  await interviewStore.getAllInterviews()
  feedbackStore.isGlobalLoading = false
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы хотите удалить собеседование?',
    header: 'Удаление собеседования',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => await deleteInterview(id)
  })
}
</script>

<template>
  <div class="interview-card">
    <div class="card-content">
      <div class="status">
        <span v-if="interview.result === 'Offer'" class="offer">Приглашение</span>
        <span v-if="interview.result === 'Refusal'" class="refusal">Отказ</span>
        <span v-if="interview.result === 'inProgress'" class="inProgress">Ожидание</span>
        <div class="card-buttons">
          <button class="edit-button" @click="editInterview(interview.id)">
            <img alt="" height="34" loading="lazy" src="../../../assets/icon/Edit.svg" width="34" />
          </button>
          <button class="delete-button" @click="confirmRemoveInterview(interview.id)">
            <img
              alt="telegram icon"
              height="34"
              loading="lazy"
              src="../../../assets/icon/Delete.svg"
              width="34"
            />
          </button>
        </div>
      </div>
      <div class="company-name card-item">
        <div class="item-name">Компания</div>
        <div class="item-content">{{ interview.company }}</div>
      </div>
      <div class="salary-range card-item">
        <div class="item-name">ЗП</div>
        <div class="item-content">
          <span v-if="!interview.salaryFrom && !interview.salaryTo">Не заполнено</span>
          <span v-else>{{ interview.salaryFrom }} - {{ interview.salaryTo }}</span>
        </div>
      </div>
      <div class="hr-name card-item">
        <div class="item-name">HR</div>
        <div class="item-content">
          <span v-if="!interview.hrName">Не заполнено</span>
          <span v-else> {{ interview.hrName }}</span>
        </div>
      </div>
      <div class="contacts card-item">
        <div class="item-name item-contact">Контакты</div>
        <div class="item-content contacts-icon">
          <span v-if="interview.contactTelegram">
            <a :href="`https://t.me/${interview.contactTelegram}`">
              <img
                alt="telegram icon"
                height="20"
                loading="lazy"
                src="../../../assets/icon/telegram.svg"
                width="20"
              />
            </a>
          </span>
          <span v-if="interview.contactWhatsApp">
            <a :href="`https://wa.me/${interview.contactWhatsApp}`">
              <img
                alt="telegram icon"
                height="20"
                loading="lazy"
                src="../../../assets/icon/whatsapp.svg"
                width="20"
              />
            </a>
          </span>
        </div>
      </div>
      <div v-for="(stage, index) in interview.stages" :key="index" class="stages">
        <div class="card-item">
          <div class="item-name">Этап</div>
          <div class="item-content">{{ index + 1 }}</div>
        </div>
        <div class="card-item">
          <div class="item-name">Название этапа</div>
          <div class="item-content">{{ stage.name }}</div>
          <div v-if="!stage.name" class="item-content">Не заполнено</div>
        </div>
        <div class="card-item">
          <div class="item-name">Дата</div>
          <div class="item-content">{{ formatDate(stage.date) }}</div>
        </div>
        <div class="card-item">
          <div class="item-name">Комментарии</div>
          <div class="item-content comments">{{ stage.description }}</div>
          <div v-if="!stage.description" class="item-content">Не заполнено</div>
        </div>
      </div>
      <div class="vacancy-link card-item">
        <a @click="formattedVacancyLink(interview.vacancyLink)">Ссылка на вакансию</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}

.interview-card {
  width: auto;
  height: auto;
  border: 1px solid var(--card-border);
  border-radius: var(--element-radius);
  display: flex;
  margin-bottom: 24px;
}

.card-content {
  width: 100%;
  padding-inline: 16px;
}

.item-name {
  width: 100%;
}

.card-item {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
  font-family: var(--manrope-medium), sans-serif;
  font-size: 12px;
  line-height: 15px;
  justify-content: space-between;
}

.contacts-icon {
  display: flex;
  justify-content: right;
}

.contacts-icon span {
  margin-left: 10px;
}

.card-item:not(:has(.comments)) {
  justify-content: space-between;
}

.item-content {
  font-family: var(--manrope-bold), sans-serif;
  font-size: 12px;
  width: 70%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  text-align: right;
}

.edit-button,
.delete-button {
  border: none;
  cursor: pointer;
  background-color: transparent;
  margin-left: 10px;
}

.card-buttons {
  display: flex;
  justify-content: flex-end;
}

.card-buttons button {
  padding: 0;
}

.card-buttons img {
  width: 34px;
  aspect-ratio: 1;
  object-fit: cover;
}

.status {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
}

.status span {
  font-family: var(--manrope-medium), sans-serif;
  font-size: 16px;
}

.offer {
  color: var(--offer-color);
}

.refusal {
  color: var(--refusal-color);
}

.inProgress {
  color: var(--inProgress-color);
  font-size: 14px;
}

.vacancy-link {
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: var(--inProgress-color);
}

.vacancy-link:active {
  color: white;
}

.item-contact {
  display: flex;
  align-items: center;
}

.company-name {
  margin-top: 20px;
}
</style>
