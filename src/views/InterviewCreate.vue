<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import type { IInterview } from '@/modules/interview/types/IInterview'
import { v4 as uuidv4 } from 'uuid'
import { ERouteNames } from '@/router/ERouteNames'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'

const router = useRouter()
const db = getFirestore()

//// TODO для всего этого можно использовать currentInterview из стора, чтобы не плодить так много рефов.
const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsApp = ref<string>('')
const contactPhone = ref<string>('')
const salaryFrom = ref<number | null>(null)
const salaryTo = ref<number | null>(null)

const loading = ref<boolean>(false)
const isSubmitted = ref(false)

//// TODO название функции не соответствует ее функционалу, лучше назвать ее submitInterview. Toggle подразумевает что мы что-то включаем или выключаем.
const toggleSubmit = () => {
  isSubmitted.value = true

  //// что такое nextTick? и зачем он здесь нужен?
  //// TODO если его удалить то ничего не ломается, значит он не нужен. На мой взгляд.
  //// проверка на валидность полей я бы вынес в отдельную функцию, например validateFields
  //// а потом вызывал бы ее вот так: const isFormValid = сomputed(()=> validateFields()) и если isFormValid.value === true, то вызывал бы addNewInterview(). Если нет то показывал бы ошибки.
  //// и соответственно вместо isSubmitted можно использовать isFormValid, а от isSubmitted можно вообще избавиться.
  nextTick(() => {
    const invalidFields = document.querySelectorAll('.is-invalid')

    if (invalidFields.length === 0) {
      addNewInterview()
    }
  })
}

const addNewInterview = async (): Promise<void> => {
  //// очень интересно, что у тебя тут включается лоадинг, но не выключается, если что-то пошло не так =)
  loading.value = true

  //// TODO этот payload нам не нужен, так как уже есть в сторе currentInterview, но важно обратить внимание что перед созданием нам нужно в него добавить id и createdAt
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
    result: 'inProgress',
    salaryFrom: salaryFrom.value,
    salaryTo: salaryTo.value,
    stages: []
  }

  if (userIdFromStorage()) {
    //// TODO await и then в одном месте это не очень хорошо, лучше использовать один из вариантов.
    //// то есть сначала await создание, а потом если создание прошло успешно то await router.push
    //// но здесь нам ещё было бы хорошо для создания интервью сделать экшен в сторе, createInterview
    await setDoc(doc(db, `users/${userIdFromStorage()}/interviews`, payload.id), payload).then(
      () => {
        router.push({ name: ERouteNames.INTERVIEW_LIST })
      }
    )
  }
}
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input-text
          v-model="company"
          :class="{ 'is-invalid': !company && isSubmitted }"
          class="input"
          placeholder="Компания"
        />
        <p v-if="!company && isSubmitted" class="error">Поле обязательно для заполнения!</p>
        <div class="salary-inputs-container">
          <app-input-number v-model="salaryFrom" class="salary-input" placeholder="ЗП-от" />
          <app-input-number v-model="salaryTo" class="salary-input" placeholder="ЗП-до" />
        </div>
        <app-input-text
          v-model="vacancyLink"
          :class="{ 'is-invalid': isSubmitted && !vacancyLink }"
          class="input"
          placeholder="Ссылка на вакансию"
        />
        <p v-if="!vacancyLink && isSubmitted" class="error">Поле обязательно для заполнения!</p>
        <app-input-text
          v-model="hrName"
          :class="{ 'is-invalid': isSubmitted && !hrName }"
          class="input"
          placeholder="Имя"
        />
        <p v-if="!hrName && isSubmitted" class="error">Поле обязательно для заполнения!</p>
        <app-input-text
          v-model="contactTelegram"
          :class="{ 'is-invalid': isSubmitted && !contactTelegram && !contactWhatsApp }"
          class="input"
          placeholder="Telegram"
        />
        <p v-if="isSubmitted && !contactTelegram && !contactWhatsApp" class="error">
          Одно из этих полей обязательно для заполнения!
        </p>
        <app-input-text
          v-model="contactWhatsApp"
          :class="{ 'is-invalid': isSubmitted && !contactTelegram && !contactWhatsApp }"
          class="input"
          placeholder="WhatsApp"
        />
        <p v-if="isSubmitted && !contactTelegram && !contactWhatsApp" class="error">
          Одно из этих полей обязательно для заполнения!
        </p>
        <app-input-text v-model="contactPhone" class="input" placeholder="Телефон" />
        <app-button
          :loading="loading"
          class="add-button"
          label="Создать собеседование"
          style="--p-button-primary-border-color: transparent"
          @click="toggleSubmit"
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
  height: 12px;
  font-family: var(--manrope-bold), sans-serif;
  font-size: 10px;
  color: var(--refusal-color);
  margin-top: -12px;
  margin-bottom: 8px;
  padding-left: 8px;
}

input.is-invalid {
  border: 1px solid var(--refusal-color);
}

:root {
  --p-emerald-500: transparent !important;
  --p-button-primary-border-color: transparent !important;
}
</style>
