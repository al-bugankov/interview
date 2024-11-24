<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'

const userStore = useUserStore()
const router = useRouter()
const db = getFirestore()
const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsApp = ref<string>('')
const contactPhone = ref<string>('')
const salaryFrom = ref<number | null>(null)
const salaryTo = ref<number | null>(null)

const loading = ref<boolean>(false)
const isSubmitted = ref(false);

const toggleSubmit = () => {
  isSubmitted.value = true

  nextTick(() => {
    const invalidFields = document.querySelectorAll('.is-invalid');
    console.log(invalidFields);

    if (invalidFields.length === 0) {
      addNewInterview();
    } else {
      console.log('Есть инвалиды');
    }
  });
}

const addNewInterview = async (): Promise<void> => {
  loading.value = true
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
  }

  if (userStore.userId) {
    await setDoc(doc(db, `users/${userStore.userId}/interviews`, payload.id), payload).then(() => {
      router.push({ name: 'List' })
    })
  }
}
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input-text class="input" placeholder="Компания" v-model="company" :class="{'is-invalid': !company && isSubmitted}" />
        <p v-if="!company && isSubmitted" class="error">Поле обязательно для заполнения!</p>
        <div class="salary-inputs-container">
          <app-input-number class="salary-input" placeholder="ЗП-от" v-model="salaryFrom" />
          <app-input-number class="salary-input" placeholder="ЗП-до" v-model="salaryTo" />
        </div>
        <app-input-text class="input" v-model="vacancyLink" placeholder="Ссылка на вакансию"  :class="{ 'is-invalid': isSubmitted && !vacancyLink }" />
        <p v-if="!vacancyLink && isSubmitted" class="error">Поле обязательно для заполнения!</p>
        <app-input-text class="input" v-model="hrName" placeholder="Имя HR" :class="{ 'is-invalid': isSubmitted && !hrName }" />
        <p v-if="!hrName && isSubmitted" class="error">Поле обязательно для заполнения!</p>
        <app-input-text class="input" v-model="contactTelegram" placeholder="Telegram username HR" :class="{ 'is-invalid': isSubmitted && (!contactTelegram && !contactWhatsApp) }" />
        <p v-if="isSubmitted && (!contactTelegram && !contactWhatsApp)" class="error">Одно из этих полей обязательно для заполнения!</p>
        <app-input-text class="input" v-model="contactWhatsApp" placeholder="WhatsApp HR" :class="{ 'is-invalid': isSubmitted && (!contactTelegram && !contactWhatsApp) }" />
        <p v-if="isSubmitted && (!contactTelegram && !contactWhatsApp)" class="error">Одно из этих полей обязательно для заполнения!</p>
        <app-input-text class="input" v-model="contactPhone" placeholder="Телефон HR" />
        <app-button
          @click="toggleSubmit"
          label="Создать собеседование"
          :loading="loading"
          class="add-button"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.input,
::v-deep .p-inputnumber-input {
  width: 100%;
  border-radius: var(--element-radius);
  font-family: var(--manrope-medium);
  font-size: 14px;
  margin-bottom: 12px;
}

::v-deep .p-inputnumber {
  width: 49%
}

.salary-inputs-container {
  display: flex;
  justify-content: space-between;
}

.input::placeholder {
  font-family: var(--manrope-medium);
  font-size: 12px;
}
.content-interview {
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: var(--element-radius);
}
::v-deep .p-card-title {
  font-family: var(--manrope-bold);
  font-size: 16px;
}

::v-deep .p-card-body {
  padding: 12px;
}

.add-button {
  width: 100%;
  background-color: var(--inProgress-color);
  border-radius: var(--element-radius);
  font-family: var(--manrope-medium);
}

.add-button:hover,
.add-button:active {
  background-color: var(--inProgress-darken) !important;
}

.error {
  height: 12px;
  font-family: var(--manrope-bold);
  font-size: 10px;
  color: var(--refusal-color);
  margin-top: -12px;
  margin-bottom: 8px;
  padding-left: 8px;
}

input.is-invalid {
  border: 1px solid var(--refusal-color);
}
</style>