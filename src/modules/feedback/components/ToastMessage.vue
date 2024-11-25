<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'

const toast = useToast()
const { toastTrigger } = storeToRefs(useFeedbackStore())
const feedbackStore = useFeedbackStore()

watch(toastTrigger, () => {
  toast.add({
    severity: feedbackStore.toast.severity,
    summary: feedbackStore.toast.summary,
    detail: feedbackStore.toast.detail,
    life: feedbackStore.toast.life
  })
})
</script>

<template>
  <app-toast />
</template>
