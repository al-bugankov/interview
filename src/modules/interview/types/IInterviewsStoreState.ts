import type { IInterview } from '@/modules/interview/types/IInterview'

export interface IInterviewsStoreState {
  interviews: IInterview[]
  selectedFilterResult: string
  currentInterview: IInterview
}
