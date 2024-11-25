import { defineStore } from 'pinia'
import type { IFeedbackStoreState } from '@/modules/feedback/types/IFeedbackStoreState'
import type { IToastType } from '@/modules/feedback/types/IToastType'

export const useFeedbackStore = defineStore('feedbackStore', {
  state: (): IFeedbackStoreState => ({
    isGlobalLoading: false,
    toastTrigger: 1,
    toast: {
      severity: 'warn',
      summary: '',
      detail: '',
      life: 3000
    }
  }),
  getters: {},
  actions: {
    showToast({
      type,
      title,
      message,
      time
    }: {
      type: IToastType
      title: string
      message: string
      time?: number
    }) {
      this.toast.severity = type
      this.toast.summary = title
      this.toast.detail = message
      this.toast.life = time || 3000
      this.toastTrigger += 1
    }
  }
})
