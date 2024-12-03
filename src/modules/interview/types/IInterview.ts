import type { IStage } from '@/modules/interview/types/IStage'
import type { TResultFilter } from '@/modules/interview/types/TResultFilter'

export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  createdAt: Date
  salaryFrom?: number | null
  salaryTo?: number | null
  stages: IStage[]
  result?: TResultFilter
}
