import type { IInterview } from '@/modules/interview/types/IInterview'

export interface IInterviewsStoreState {
  interviews: IInterview[]
  selectedFilterResult: string
  interviewId: string
  currentInterview: IInterview
}
