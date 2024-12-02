<script setup lang="ts">
import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import { useConfirm } from 'primevue/useconfirm'
import { ERouteNames } from '@/router/ERouteNames'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utyls/formatDate'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'

defineProps(['interview', 'id']);

const router = useRouter()
const confirm = useConfirm()
const interviewStore = useInterviewStore()
const feedbackStore = useFeedbackStore()
const userStore = useAuthStore()
const db = getFirestore()




const formattedVacancyLink = (link: string) => {
  const formattedlink = link.trim() // Убираем лишние пробелы
  // Проверяем, начинается ли ссылка с http или https
  const url = /^https?:\/\//.test(formattedlink) ? formattedlink : `https://${formattedlink}`
  // Открываем ссылку в новой вкладке
  window.open(url, '_blank', 'noopener,noreferrer')
}

const editInterview = (id: string) => {
  router.push({
    name: ERouteNames.INTERVIEW_ID,
    params: { id }
  })
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
    accept: async () => {
     feedbackStore.isGlobalLoading = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
      await interviewStore.getAllInterviews()
      feedbackStore.isGlobalLoading = false
    }
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
src="@/assets/icon/telegram.svg"
alt="telegram icon"
width="20" height="20" loading="lazy"
/>
                </a>
              </span>
          <span v-if="interview.contactWhatsApp">
                <a :href="`https://wa.me/${interview.contactWhatsApp}`">
<img
  src="@/assets/icon/whatsapp.svg"
  alt="telegram icon"
  width="20" height="20" loading="lazy"
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
    <div class="card-buttons">
      <button class="edit-button" @click="editInterview(interview.id)">
        <img
        src="@/assets/icon/Edit.svg"
        alt=""
        width="34" height="34" loading="lazy"
        />
      </button>
      <button class="delete-button" @click="confirmRemoveInterview(interview.id)">
        <img
          src="@/assets/icon/Delete.svg"
          alt="telegram icon"
          width="34" height="34" loading="lazy"
        />
      </button>
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
  width: 240px;
  padding-left: 16px;
}

.card-item {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
  font-family: var(--manrope-medium), sans-serif;
  font-size: 11px;
  line-height: 15px;
}

.contacts-icon {
  display: flex;
  justify-content: right;
}

.card-item:not(:has(.comments)) {
  justify-content: space-between;
}

.item-content {
  font-family: var(--manrope-bold), sans-serif;
  font-size: 12px;
  width: 64%;
  margin-left: 5px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  text-align: right;
}

.item-content span {
  margin-inline: 6px;
}

.edit-button,
.delete-button {
  border: none;
  cursor: pointer;
  background-color: transparent;
}

.edit-button {
  margin-left: 6px;
}

.card-buttons {
  width: 79px;
  display: flex;
  align-items: start;
  margin-right: 24px;
}

.card-buttons img {
  width: 34px;
  aspect-ratio: 1;
  object-fit: cover;
}

.card-content,
.card-buttons {
  padding-top: 16px;
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
}

.item-contact {
  display: flex;
  align-items: center;
}

.company-name {
  margin-top: 10px;
}

</style>