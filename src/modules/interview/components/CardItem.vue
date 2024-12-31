<script lang="ts" setup>
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import { useConfirm } from 'primevue/useconfirm'
import { ERouteNames } from '@/router/ERouteNames'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utyls/formatDate'

import type { IInterview } from '@/modules/interview/types/IInterview'

defineProps<{
  interview: IInterview
}>()

const router = useRouter()
const confirm = useConfirm()
const interviewStore = useInterviewStore()

const openVacancyLink = (link: string) => {
  const formattedlink = link.trim()
  const url = /^https?:\/\//.test(formattedlink) ? formattedlink : `https://${formattedlink}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

const goToEditInterview = (id: string) => {
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
    accept: async () => await interviewStore.deleteInterview(id)
  })
}
</script>

<template>
  <div class="interview-card">
    <div class="interview-card__content">
      <div class="interview-card__status">
        <span v-if="interview.result === 'Offer'" class="interview-card__status--offer"
          >Приглашение</span
        >
        <span v-if="interview.result === 'Refusal'" class="interview-card__status--refusal"
          >Отказ</span
        >
        <span v-if="interview.result === 'inProgress'" class="interview-card__status--in-progress"
          >Ожидание</span
        >
        <div class="interview-card__buttons">
          <button
            class="interview-card__button interview-card__button--edit"
            @click="goToEditInterview(interview.id)"
          >
            <img alt="" height="34" loading="lazy" src="../../../assets/icon/Edit.svg" width="34" />
          </button>
          <button
            class="interview-card__button interview-card__button--delete"
            @click="confirmRemoveInterview(interview.id)"
          >
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
      <div class="interview-card__item interview-card__item--company">
        <div class="interview-card__item-name">Компания</div>
        <div class="interview-card__item-content">{{ interview.company }}</div>
      </div>
      <div class="interview-card__item interview-card__item--salary">
        <div class="interview-card__item-name">ЗП</div>
        <div class="interview-card__item-content">
          <span v-if="!interview.salaryFrom && !interview.salaryTo">Не заполнено</span>
          <span v-else>{{ interview.salaryFrom }} - {{ interview.salaryTo }}</span>
        </div>
      </div>
      <div class="interview-card__item interview-card__item--hr">
        <div class="interview-card__item-name">HR</div>
        <div class="interview-card__item-content">
          <span v-if="!interview.hrName">Не заполнено</span>
          <span v-else> {{ interview.hrName }}</span>
        </div>
      </div>
      <div class="contacts interview-card__item">
        <div class="interview-card__item-name interview-card__item--contacts">Контакты</div>
        <div class="interview-card__item-content interview-card__item-content-contacts-icon">
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
      <div v-for="(stage, index) in interview.stages" :key="index" class="interview-card__stage">
        <div class="interview-card__item">
          <div class="interview-card__item-name">Этап</div>
          <div class="interview-card__item-content">{{ index + 1 }}</div>
        </div>
        <div class="interview-card__item">
          <div class="interview-card__item-name">Название этапа</div>
          <div class="interview-card__item-content">{{ stage.name }}</div>
          <div v-if="!stage.name" class="interview-card__item-content">Не заполнено</div>
        </div>
        <div class="interview-card__item">
          <div class="interview-card__item-name">Дата</div>
          <div class="interview-card__item-content">{{ formatDate(stage.date) }}</div>
        </div>
        <div class="interview-card__item">
          <div class="interview-card__item-name">Комментарии</div>
          <div class="interview-card__item-content interview-card__item-content-comments">
            {{ stage.description }}
          </div>
          <div v-if="!stage.description" class="interview-card__item-content">Не заполнено</div>
        </div>
      </div>
      <div class="interview-card__item interview-card__item-content-vacancy">
        <a @click="openVacancyLink(interview.vacancyLink)">Ссылка на вакансию</a>
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

.interview-card__content {
  width: 100%;
  padding-inline: 16px;
}

.interview-card__item-name {
  width: 100%;
}

.interview-card__item {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
  font-family: var(--manrope-medium), sans-serif;
  font-size: 12px;
  line-height: 15px;
  justify-content: space-between;
  color: var(--primary-text-color);
}

.interview-card__item-content-contacts-icon {
  display: flex;
  justify-content: right;
}

.interview-card__item-content-contacts-icon span {
  margin-left: 10px;
}

.interview-card__item:not(:has(.interview-card__item-content-comments)) {
  justify-content: space-between;
}

.interview-card__item-content {
  font-family: var(--manrope-bold), sans-serif;
  font-size: 12px;
  width: 70%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  text-align: right;
}

.interview-card__button {
  border: none;
  cursor: pointer;
  background-color: transparent;
  margin-left: 10px;
  padding: 0;
}

.interview-card__buttons {
  display: flex;
  justify-content: flex-end;
}

.interview-card__buttons img {
  width: 34px;
  aspect-ratio: 1;
  object-fit: cover;
}

.interview-card__status {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
}

.interview-card__status span {
  font-family: var(--manrope-medium), sans-serif;
  font-size: 16px;
}

.interview-card__status--offer {
  color: var(--offer-color);
}

.interview-card__status--refusal {
  color: var(--refusal-color);
}

.interview-card__status--in-progress {
  color: var(--inProgress-color);
  font-size: 14px;
}

.interview-card__item-content-vacancy {
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: var(--inProgress-color);
}

.interview-card__item-content-vacancy:active {
  color: white;
}

.interview-card__item--contacts {
  display: flex;
  align-items: center;
}

.interview-card__item--company {
  margin-top: 20px;
}
</style>
