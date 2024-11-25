<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { useConfirm } from 'primevue/useconfirm'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import type { TResultFilter } from '@/interfaces'
import { ERouteNames } from '@/router/ERouteNames'

const interviewStore = useInterviewStore()
const userStore = useAuthStore()
const db = getFirestore()
const confirm = useConfirm()
const selectedFilterResult = ref<string>('') // Стартовое значение фильтра
const isLoading = ref<boolean>(true)

const formattedVacancyLink = (link: string) => {
  const formattedlink = link.trim() // Убираем лишние пробелы
  // Проверяем, начинается ли ссылка с http или https
  const url = /^https?:\/\//.test(formattedlink) ? formattedlink : `https://${formattedlink}`
  // Открываем ссылку в новой вкладке
  window.open(url, '_blank', 'noopener,noreferrer')
}


onMounted(async () => {
  try {
    isLoading.value = true
    console.log('Fetching interviews...')
    console.log('Selected filter on mount:', selectedFilterResult.value) // Логируем фильтр при загрузке
    await interviewStore.getAllInterviews()
  } catch (error) {
    console.error('Error fetching interviews:', error)
  } finally {
    isLoading.value = false
  }

  await nextTick() // Ждём, пока DOM обновится
  const activeButton = document.getElementById('all-button')
  if (activeButton) {
    activeButton.classList.add('active')
  }
})

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
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
      await interviewStore.getAllInterviews()
      isLoading.value = false
    }
  })
}

const submitFilter = async (filterValue: TResultFilter) => {
  console.log('Setting filter to:', filterValue)
  interviewStore.setFilterResult(filterValue) // Используем метод из interviewStore
  await interviewStore.getAllInterviews(true)
}

// Метод для сброса фильтра
const clearFilter = async () => {
  interviewStore.setFilterResult('') // Очищаем фильтр
  await interviewStore.getAllInterviews()
}

// Логируем изменения selectedFilterResult
watch(selectedFilterResult, (newValue) => {
  console.log('Filter value changed:', newValue) // Логируем, когда фильтр меняется
  // Удаляем класс 'active' с всех кнопок
  const allButtons = document.querySelectorAll('.filter-button')
  allButtons.forEach((button) => button.classList.remove('active'))

  // Определяем ID кнопки, которую нужно активировать
  let buttonId = ''

  if (newValue === 'Offer') {
    buttonId = 'offer-button'
  } else if (newValue === 'Refusal') {
    buttonId = 'refusal-button'
  } else if (newValue === 'inProgress') {
    buttonId = 'inProgress-button'
  } else {
    buttonId = 'all-button' // Если фильтр не установлен, активируем all-button
  }

  // Используем MutationObserver для отслеживания появления кнопки в DOM
  const observer = new MutationObserver(() => {
    const button = document.getElementById(buttonId)
    if (button) {
      button.classList.add('active') // Добавляем класс active на найденную кнопку
      observer.disconnect() // Останавливаем наблюдение после нахождения кнопки
    }
  })

  // Настройка наблюдателя: отслеживаем добавление новых узлов в документ
  observer.observe(document.body, { childList: true, subtree: true })
})
</script>

<template>
  <app-dialog
    :style="{
      width: '270px',
      height: '215px',
      color: '#000000',
      fontFamily: 'var(--manrope-medium)',
      fontSize: '14px',
      '--p-dialog-title-font-size': '16px',
      '--p-dialog-border-radius': '20px',
      '--p-button-border-radius': '20px'
    }"
  />

  <div class="main-content">
    <div class="header-container">
      <div class="header-text">
        <span>Мои собеседования</span>
      </div>
      <router-link :to="{ name: ERouteNames.INTERVIEW_CREATE }">
        <button class="header-button scale-button" type="button">
          <svg
            class="scale-svg"
            fill="none"
            height="34"
            viewBox="0 0 34 34"
            width="34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect fill="#ECECEC" height="34" rx="12" width="34" />
            <g clip-path="url(#clip0_103_1108)">
              <path
                d="M17 10.875V23.125"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M10.875 17H23.125"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </g>
            <defs>
              <clipPath id="clip0_103_1108">
                <rect fill="white" height="14" transform="translate(10 10)" width="14" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </router-link>
    </div>

    <div class="nav-button-container">
      <button id="all-button" class="filter-button" type="button" @click="clearFilter">Все</button>
      <button id="offer-button" class="filter-button" type="button" @click="submitFilter('Offer')">
        Приглашение
      </button>
      <button
        id="refusal-button"
        class="filter-button"
        type="button"
        @click="submitFilter('Refusal')"
      >
        Отказ
      </button>
      <button
        id="inProgress-button"
        class="filter-button"
        type="button"
        @click="submitFilter('inProgress')"
      >
        Ожидание
      </button>
    </div>

    <app-message v-if="!interviewStore.interviews.length" severity="info">
      Нет добавленных собеседований
    </app-message>

    <div class="content-container">
      <div v-for="(interview, id) in interviewStore.interviews" :key="id" class="interview-card">
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
            <div class="item-content">
              <span v-if="interview.contactTelegram">
                <a :href="`https://t.me/${interview.contactTelegram}`" class="scale-button">
                  <svg
                    class="scale-svg"
                    fill="none"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect fill="#27A6E5" height="20" rx="10" width="20" />
                    <path
                      d="M14 6.30111L12.4973 14.1461C12.4973 14.1461 12.287 14.6901 11.7094 14.4292L8.24229 11.6763L8.22621 11.6682C8.69454 11.2327 12.3262 7.85133 12.4849 7.69806C12.7306 7.46068 12.5781 7.31936 12.2928 7.49868L6.9284 11.0265L4.85882 10.3054C4.85882 10.3054 4.53313 10.1854 4.5018 9.92455C4.47005 9.66327 4.86954 9.52195 4.86954 9.52195L13.3066 6.09447C13.3066 6.09447 14 5.77896 14 6.30111Z"
                      fill="#FEFEFE"
                    />
                  </svg>
                </a>
              </span>
              <span v-if="interview.contactWhatsApp">
                <a :href="`https://wa.me/${interview.contactWhatsApp}`" class="scale-button">
                  <svg
                    class="scale-svg"
                    fill="none"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect fill="#48C95F" height="20" rx="10" width="20" />
                    <path
                      d="M13.9634 6.03125C12.9756 5.04687 11.6585 4.5 10.2683 4.5C7.37805 4.5 5.03658 6.83333 5.03658 9.71354C5.03658 10.625 5.29268 11.5365 5.73171 12.3021L5 15L7.78049 14.2708C8.54878 14.6719 9.39024 14.8906 10.2683 14.8906C13.1585 14.8906 15.5 12.5573 15.5 9.67708C15.4634 8.32813 14.9512 7.01562 13.9634 6.03125ZM12.7927 11.5729C12.6829 11.8646 12.1707 12.1562 11.9146 12.1927C11.6951 12.2292 11.4024 12.2292 11.1098 12.1562C10.9268 12.0833 10.6707 12.0104 10.378 11.8646C9.06098 11.3177 8.21951 10.0052 8.14634 9.89583C8.07317 9.82292 7.59756 9.20312 7.59756 8.54687C7.59756 7.89062 7.92683 7.59896 8.03658 7.45312C8.14634 7.30729 8.29268 7.30729 8.40244 7.30729C8.47561 7.30729 8.58536 7.30729 8.65854 7.30729C8.73171 7.30729 8.84146 7.27083 8.95122 7.52604C9.06098 7.78125 9.31707 8.4375 9.35366 8.47396C9.39024 8.54688 9.39024 8.61979 9.35366 8.69271C9.31707 8.76562 9.28049 8.83854 9.20732 8.91146C9.13414 8.98437 9.06097 9.09375 9.02439 9.13021C8.95122 9.20312 8.87805 9.27604 8.95122 9.38542C9.02439 9.53125 9.28049 9.93229 9.68293 10.2969C10.1951 10.7344 10.5976 10.8802 10.7439 10.9531C10.8902 11.026 10.9634 10.9896 11.0366 10.9167C11.1098 10.8437 11.3659 10.5521 11.439 10.4063C11.5122 10.2604 11.622 10.2969 11.7317 10.3333C11.8415 10.3698 12.5 10.6979 12.6098 10.7708C12.7561 10.8438 12.8293 10.8802 12.8659 10.9167C12.9024 11.026 12.9024 11.2812 12.7927 11.5729Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </span>
              <span v-if="interview.contactPhone"></span>
            </div>
          </div>
          <div v-for="(stage, index) in interview.stages" :key="index" class="stages">
            <div v-if="index !== undefined" class="card-item">
              <div class="item-name">Этап</div>
              <div class="item-content">{{ index + 1 }}</div>
            </div>
            <div v-if="stage.name !== undefined && stage.name !== ''" class="card-item">
              <div class="item-name">Название этапа</div>
              <div class="item-content">{{ stage.name }}</div>
            </div>
            <div v-if="stage.date !== null" class="card-item">
              <div class="item-name">Дата</div>
              <div class="item-content">{{ stage.date }}</div>
            </div>
            <div
              v-if="stage.description !== undefined && stage.description !== ''"
              class="card-item"
            >
              <div class="item-name">Комментарии</div>
              <div class="item-content">{{ stage.description }}</div>
            </div>
          </div>
          <div class="vacancy-link card-item">
            <a @click="formattedVacancyLink(interview.vacancyLink)">Ссылка на вакансию</a>
          </div>
        </div>
        <div class="card-buttons">
          <router-link :to="{ name: ERouteNames.INTERVIEW_ID, params: { id: interview.id } }">
            <button class="scale-button edit-button">
              <svg
                class="scale-svg"
                fill="none"
                height="34"
                viewBox="0 0 34 34"
                width="34"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect fill="#ECECEC" height="34" rx="12" width="34" />
                <path
                  d="M20.0779 11.5014C20.2368 11.3424 20.4255 11.2163 20.6332 11.1303C20.8409 11.0443 21.0635 11 21.2883 11C21.513 11 21.7356 11.0443 21.9433 11.1303C22.151 11.2163 22.3397 11.3424 22.4986 11.5014C22.6576 11.6603 22.7837 11.849 22.8697 12.0567C22.9557 12.2644 23 12.487 23 12.7117C23 12.9365 22.9557 13.1591 22.8697 13.3668C22.7837 13.5745 22.6576 13.7632 22.4986 13.9221L14.3286 22.0922L11 23L11.9078 19.6714L20.0779 11.5014Z"
                  stroke="#27A6E5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </router-link>
          <button class="scale-button delete-button" @click="confirmRemoveInterview(interview.id)">
            <svg
              class="scale-svg"
              fill="none"
              height="34"
              viewBox="0 0 34 34"
              width="34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect fill="#ECECEC" height="34" rx="12" width="34" />
              <g clip-path="url(#clip0_125_74)">
                <path
                  d="M23 11L11 23"
                  stroke="#FF0000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
                <path
                  d="M11 11L23 23"
                  stroke="#FF0000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </g>
              <defs>
                <clipPath id="clip0_125_74">
                  <rect fill="white" height="14" transform="translate(10 10)" width="14" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
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

.main-content {
  height: auto;
}

.filter-button {
  height: 28px;
  border-radius: var(--element-radius);
  padding: 6px 8px;
  background-color: #d4d4d4;
  border: none;
  margin-right: 6px;
  cursor: pointer;
  margin-bottom: 12px;
  font-family: var(--manrope-bold);
  font-size: 12px;
}

.nav-button-container,
.header-container {
  padding-inline: 10px;
}

.filter-button:active,
.filter-button.active,
.filter-button:focus-within {
  background-color: var(--active-background);
  color: white;
  cursor: pointer;
}

.scale-button {
  border: none;
  background-color: transparent;
}

.scale-svg {
  transition: transform 0.4s ease-in-out; /* Плавный переход для изменения масштаба */
}

.scale-button:active .scale-svg {
  transform: scale(1.1, 1.1); /* Увеличение масштаба SVG */
}

.content-container {
  width: 100%;
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
  width: 75%;
  padding-left: 16px;
  padding-right: 10px;
}

.card-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 12px;
  font-family: var(--manrope-medium);
  font-size: 11px;
  line-height: 15px;
}

.item-content {
  font-family: var(--manrope-bold);
  font-size: 12px;
}

.item-content span {
  margin-inline: 6px;
}

.edit-button,
.delete-button {
  width: 34px;
  aspect-ratio: 1;
  border: none;
  cursor: pointer;
  background-color: transparent;
}

.edit-button {
  margin-right: 6px;
}

.card-buttons {
  width: 25%;
  display: flex;
  align-items: start;
  margin-right: 24px;
  justify-content: flex-end;
}

.card-content,
.card-buttons {
  padding-top: 16px;
}

.header-text,
.header-button {
  font-family: var(--manrope-bold);
  font-size: 16px !important;
  display: flex;
  align-items: center;
}

.header-container {
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin-bottom: 16px;
}

.status span {
  font-family: var(--manrope-medium);
}

.offer {
  color: var(--offer-color);
}

.refusal,
.p-confirmdialog-accept-button {
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

.header-text {
  font-family: var(--manrope-bold);
  font-size: 16px;
}

.item-contact {
  display: flex;
  align-items: center;
}

.company-name {
  margin-top: 10px;
}
</style>
