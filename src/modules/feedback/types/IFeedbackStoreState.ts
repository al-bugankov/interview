import type { IToastType } from '@/modules/feedback/types/IToastType'

export interface IFeedbackStoreState {
  isGlobalLoading: boolean
  toastTrigger: number
  toast: {
    severity: IToastType
    summary: string
    detail: string
    life: number
  }
}
